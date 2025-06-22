from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.v1 import organization, gen_ai, grants
from app.deps.gemini_service import GeminiService
from app.settings import get_settings
from app.utils import DbDependency
from app.api.routes import auth
from app.api.routes.auth import CurrentUser


app = FastAPI()
app.include_router(auth.router)
app.include_router(organization.router)
app.include_router(gen_ai.router)
app.include_router(grants.router)


settings = get_settings()
origins = [settings.frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"Hello": "API"}


@app.get("/user/me", status_code=status.HTTP_200_OK)
async def user(user: CurrentUser, db: DbDependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    return {"user": user}
