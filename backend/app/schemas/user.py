from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    role: str
    is_active: bool = False
    activation_status: str = "pending"


class UserCreate(UserBase):
    password: str  # This will be hashed in the backend


class UserRead(UserBase):
    id: UUID
    reset_password_token: Optional[str] = None
    reset_password_expires: Optional[datetime] = None

    class Config:
        from_attributes = True
