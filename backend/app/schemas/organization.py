from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class OrganizationBase(BaseModel):
    organization_name: str
    address: str
    contact_info: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    organization_name: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[str] = None


class OrganizationRead(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ListOrganizationParams(BaseModel):
    keyword: str | None = Field(
        None,
        description="Optional keyword to filter Organization"
    )
