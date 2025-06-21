from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class Organization(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "organizations"
    organization_name: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str] = mapped_column(String, nullable=False)
    contact_info: Mapped[str] = mapped_column(String, nullable=False)

    users: Mapped["User"] = relationship("User", back_populates="organization")
