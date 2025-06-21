from typing import Sequence
from fastapi import Depends, HTTPException, status
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.organization import Organization
from app.schemas.organization import (
    ListOrganizationParams,
    OrganizationCreate,
    OrganizationUpdate
)
from app.db.session import get_db
from app.schemas.params import pagination


async def create_organization(
    data: OrganizationCreate,
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """Create an organization based on `OrganizationCreate`."""
    try:
        org_data = data.model_dump()
        org = Organization(**org_data)
        db.add(org)
        await db.commit()
        await db.refresh(org)
        return org
    except Exception as e:
        await db.rollback()
        raise e


async def list_organizations(
    params: ListOrganizationParams = Depends(),
    pagination_params: tuple[int, int] = Depends(pagination),
    db: AsyncSession = Depends(get_db)
) -> Sequence:
    """Fetch a list of all organizations based on `ListOrganizationParams`."""
    skip, limit = pagination_params
    try:
        query = select(Organization).offset(skip).limit(limit)

        if params.keyword:
            query = query.filter(Organization.organization_name.ilike(f"%{params.keyword}%"))

        result = await db.execute(query)
        orgs = result.scalars().all()
        return orgs
    except Exception as e:
        raise e


async def get_organization_by_id(
    organization_id: str,
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """Fetch an organization entry based on `organization_id`."""
    try:
        result = await db.execute(
            select(Organization).where(Organization.id == organization_id)
        )
        org = result.scalars().first()

        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

        return org
    except Exception as e:
        raise e


async def update_organization(
    organization_id: str,
    data: OrganizationUpdate,
    db: AsyncSession = Depends(get_db)
) -> Organization:
    """Update an organization entry based on `organization_id` and `OrganizationUpdate`."""
    try:
        result = await db.execute(
            select(Organization).where(Organization.id == organization_id)
        )
        org = result.scalars().first()

        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

        org_data = data.model_dump(exclude_unset=True)
        stmt = (
            update(Organization)
            .where(Organization.id == organization_id)
            .values(**org_data)
        )

        await db.execute(stmt)
        await db.commit();

        await db.refresh(org)
        return org

    except Exception as e:
        raise e


async def delete_organization(
    organization_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete an organization entry based on `organization_id`."""
    try:
        result = await db.execute(
            delete(Organization).where(Organization.id == organization_id)
        )

        await db.commit()

        if result.rowcount == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    except Exception as e:
        raise e
