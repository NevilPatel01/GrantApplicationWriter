from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from typing import Annotated
from fastapi import Depends
from app.db.session import get_db
import uuid
from uuid import UUID
from app.settings import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
DbDependency = Annotated[AsyncSession, Depends(get_db)]


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(username: str, user_id: UUID, expires_delta: timedelta):
    encode = {
        "sub": username,
        "id": str(user_id),
        "exp": datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(encode, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(data: dict) -> str:
    return jwt.encode(data, "SECRET", algorithm="HS256")


def generate_activation_token() -> str:
    return str(uuid.uuid4())


async def authenticate_user(username: str, password: str, db: AsyncSession):
    stmt = select(User).where(User.username == username)
    result = await db.execute(stmt)
    user: User = result.scalars().first()
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user
