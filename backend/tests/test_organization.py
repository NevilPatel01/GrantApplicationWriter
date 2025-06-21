import pytest


@pytest.mark.asyncio
async def test_unauthorized_create_organization(async_client):
    # This should be removed and replaced with a real test!
    response = await async_client.post(
        "/organizations/",
        json={
            "organization_name": "Test Organization",
            "address": "123 Test St",
            "contact_info": "123-456-7890",
        },
    )
    assert response.status_code == 401