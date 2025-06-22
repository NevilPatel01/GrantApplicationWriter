"""
Grant Application Generation API Routes
"""
import os
import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from pathlib import Path

from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["grants"]
)

class CompanyInfo(BaseModel):
    companyName: str
    description: str
    address: str = ""
    email: str = ""
    phone: str = ""
    employeeCount: str = ""
    annualRevenue: str = ""
    industry: str = ""
    website: str = ""

class SelectedTemplate(BaseModel):
    title: str = "SBIR Phase I"
    agency: str = "NSF"
    amount: str = "$275,000"
    duration: str = "6-12 months"
    category: str = "Technology Innovation"

class GrantApplicationRequest(BaseModel):
    companyInfo: CompanyInfo
    selectedTemplate: SelectedTemplate = SelectedTemplate()
    questionAnswers: Dict[str, str] = {}
    
class GrantApplicationResponse(BaseModel):
    status: str
    generated_application: str
    message: str

@router.post("/generate-grant-application", response_model=GrantApplicationResponse)
async def generate_grant_application(request: GrantApplicationRequest):
    """
    Generate a professional grant application using company data and Gemini AI.
    
    Args:
        request: Company information and grant details
        
    Returns:
        Generated grant application content
    """
    try:
        logger.info("Received grant application generation request")
        
        # Initialize Gemini service
        gemini_service = GeminiService()
        
        # Validate API key
        if not gemini_service.validate_api_key():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gemini API key validation failed. Please check your configuration."
            )
        
        # Read the base prompt from prompt.txt
        prompt_file_path = Path(__file__).parent.parent.parent.parent / "prompt.txt"
        
        if not prompt_file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Prompt template file not found"
            )
        
        with open(prompt_file_path, 'r', encoding='utf-8') as f:
            base_prompt = f.read()
        
        # Convert request to dict for processing
        company_data = request.dict()
        
        # Generate the grant application
        generated_application = await gemini_service.generate_grant_application(
            base_prompt=base_prompt,
            company_data=company_data
        )
        
        if not generated_application:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate grant application"
            )
        
        logger.info("Grant application generated successfully")
        
        return GrantApplicationResponse(
            status="success",
            generated_application=generated_application,
            message="Grant application generated successfully"
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error generating grant application: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred while generating grant application"
        )

@router.get("/validate-api-key")
async def validate_api_key():
    """
    Validate that the Gemini API key is properly configured and working.
    
    Returns:
        API key validation status
    """
    try:
        gemini_service = GeminiService()
        is_valid = gemini_service.validate_api_key()
        
        return {
            "status": "success" if is_valid else "error",
            "api_key_valid": is_valid,
            "message": "API key is valid" if is_valid else "API key validation failed"
        }
        
    except Exception as e:
        logger.error(f"Error validating API key: {str(e)}")
        return {
            "status": "error",
            "api_key_valid": False,
            "message": f"Error validating API key: {str(e)}"
        }
