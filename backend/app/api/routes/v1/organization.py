from fastapi import APIRouter, Depends, status
from typing import List

from app.schemas.organization import OrganizationRead
from app.api.routes.auth import get_current_user
from app.deps.organization import (
    create_organization,
    delete_organization,
    get_organization_by_id,
    list_organizations,
    update_organization,
)


router = APIRouter(
    prefix="/organizations",
    tags=["organizations"],
    dependencies=[Depends(get_current_user)]
)


@router.post(
    "/",
    response_model=OrganizationRead,
    status_code=status.HTTP_201_CREATED
)
async def create_organization_or(
    result: OrganizationRead = Depends(create_organization)
):
    """Create an organization entry."""
    return result


@router.get(
    "/",
    response_model=List[OrganizationRead],
    status_code=status.HTTP_200_OK
)
async def list_orgs_or_404(
    result: List[OrganizationRead] = Depends(list_organizations)
):
    """Fetch a list containing organizations."""
    return result


@router.get(
    "/{organization_id}",
    status_code = status.HTTP_200_OK
)
async def get_organization(
    result = Depends(get_organization_by_id)
):
    """Fetch a single organization by id."""
    return result


@router.put(
    "/{organization_id}",
    response_model=OrganizationRead,
    status_code=status.HTTP_200_OK
)
async def update_organization_(
    result: OrganizationRead = Depends(update_organization)
):
    """Update an organization entry."""
    return result


@router.delete(
    "/{organization_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_organization_(
    result = Depends(delete_organization)
):
    """Delete an organization entry."""
    return result
