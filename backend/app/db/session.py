from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker
)

from app.settings import get_settings

settings = get_settings()

engine = create_async_engine(settings.db_url)
AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency to get a DB session per request
async def get_db():
    # db: Session = SessionLocal()
    db: AsyncSession = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
