from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from starlette import status
from app.models.user import User
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from app.schemas.auth import CreateUserRequest, Token
from app.settings import get_settings
from app.utils import (
    hash_password,
    DbDependency,
    authenticate_user,
    create_access_token,
)

settings = get_settings()

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: DbDependency, create_user_request: CreateUserRequest):

    existing = await db.scalar(
        select(User).where(User.username == create_user_request.username)
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A user with this username already exists"
        )


    create_user_model = User(
        username=create_user_request.username,
        hashed_password=hash_password(create_user_request.password),
    )

    try:
        db.add(create_user_model)
        await db.commit()
        return {"ok": True, "message": "User created"}, status.HTTP_201_CREATED

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User creation failed due to database error"
        )


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbDependency
):
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )
    token = create_access_token(
        user.username, user.id, timedelta(minutes=settings.access_token_expire_minutes)
    )
    return {"access_token": token, "token_type": "bearer"}


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user. ",
            )
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user. "
        )


CurrentUser = Annotated[dict, Depends(get_current_user)]
