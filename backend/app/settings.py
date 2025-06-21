from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from os import getenv


def get_env_file():
    return ".env"


class Settings(BaseSettings):
    title: str = ""
    frontend_url: str
    docs_url: str = "/docs"
    openapi_url: str = "/openapi"
    redoc_url: str = "/redoc"
    prefix: str = ""
    tags: list[str] = [""]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]
    cors_origins: list[str] = ["*"]
    env_name: str
    db_url: str

    # JWT Settings
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int

    test_db_url: str | None = None

    model_config = SettingsConfigDict(env_file=f"{get_env_file()}")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
