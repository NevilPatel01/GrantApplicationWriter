from typing import TYPE_CHECKING
import uuid
from app.models.base import TimestampMixin, UUIDMixin, Base
from sqlalchemy import (
    String,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

# if TYPE_CHECKING:
#     from app.models.organization import Organization
#     from app.models.roles import UserRole


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"
    organization_id: Mapped[uuid.UUID] = mapped_column(
        pgUUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=True
    )
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")
    roles: Mapped["UserRole"] = relationship(
        "UserRole", back_populates="user", cascade="all, delete-orphan"
    )
