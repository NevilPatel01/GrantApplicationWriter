import asyncio
import subprocess
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
import pytest
import pytest_asyncio

from app.main import app
from app.models.base import Base
from app.settings import get_settings


settings = get_settings()
settings.db_url


engine = create_async_engine(settings.db_url)
TestingSessionLocal = async_sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture(scope="session")
def event_loop():
    """Create a fresh event loop for each test"""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
def override_settings():
    """Override settings for testing"""
    settings.db_url = settings.test_db_url


@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture(autouse=True)
async def clean_db():
    """Clean database between tests"""
    async with engine.begin() as conn:
        # Simple truncate approach
        await conn.execute(text("TRUNCATE users CASCADE"))
        await conn.commit()
