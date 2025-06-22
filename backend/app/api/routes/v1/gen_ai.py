import json
from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile
from google.auth import default

from app.deps.gemini_service import GeminiService, create_grant_template_endpoint
from app.settings import get_settings


router = APIRouter(
    prefix="",
    tags=["gen"]
)

settings = get_settings()
gemini_service = GeminiService(settings.gemini_api_key)

@router.post("/generate-grant-template")
async def generate_grant(
    user_context: str = Form(...),  # JSON string of user info
    files: List[UploadFile] = File(default=[]),
    additional_instructions: Optional[str] = Form(None)
):
    context_data = json.loads(user_context)
    grant_template = File(default=[])

    result = await create_grant_template_endpoint(
        gemini_service=gemini_service,
        user_context=context_data,
        files=files,
        grant_template_file=grant_template,
        additional_instructions=additional_instructions
    )

    return result



