from fastapi import Query


async def pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(5, ge=0)
) -> tuple[int, int]:
    capped_limit = min(100, limit)
    return (skip, capped_limit)
