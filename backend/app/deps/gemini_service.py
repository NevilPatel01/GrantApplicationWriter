import os
import asyncio
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi import HTTPException, UploadFile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini service with API key
        
        Args:
            api_key: Google AI API key. If None, will try to get from environment
        """
        self.api_key = api_key
        if not self.api_key:
            raise ValueError("Google AI API key is required. Set GOOGLE_AI_API_KEY environment variable or pass api_key parameter.")
        
        # Configure the API
        genai.configure(api_key=self.api_key)
        
        # Initialize the model (using latest Gemini Pro)
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        # Safety settings - adjust as needed
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }

    async def _upload_file_to_gemini(self, file_content: bytes, file_name: str, mime_type: str) -> Any:
        """
        Upload file to Gemini API for processing
        
        Args:
            file_content: File content as bytes
            file_name: Name of the file
            mime_type: MIME type of the file
            
        Returns:
            Uploaded file object
        """
        try:
            # Save temporarily to upload (Gemini requires file path)
            temp_path = f"/tmp/{file_name}"
            with open(temp_path, "wb") as f:
                f.write(file_content)
            
            # Upload to Gemini
            uploaded_file = genai.upload_file(path=temp_path, display_name=file_name)
            
            # Clean up temp file
            os.remove(temp_path)
            
            logger.info(f"Uploaded file: {file_name} with URI: {uploaded_file.uri}")
            return uploaded_file
            
        except Exception as e:
            logger.error(f"Error uploading file {file_name}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload file {file_name}: {str(e)}")

    async def generate_grant_template(
        self,
        user_context: Dict[str, Any],
        files: List[UploadFile],
        grant_template_file: UploadFile,
        additional_instructions: Optional[str] = None
    ) -> str:
        """
        Generate a grant template using Gemini API
        
        Args:
            user_context: Dictionary containing user/startup information
            files: List of additional files for context
            grant_template_file: The template file to use as inspiration
            additional_instructions: Optional additional instructions for generation
            
        Returns:
            Generated grant template in markdown format
        """
        try:
            # Prepare the context text
            context_text = self._format_user_context(user_context)
            
            # Upload files to Gemini
            uploaded_files = []
            
            # Upload the grant template file first
            template_content = await grant_template_file.read()
            template_file = await self._upload_file_to_gemini(
                template_content, 
                grant_template_file.filename,
                grant_template_file.content_type or "application/octet-stream"
            )
            uploaded_files.append(template_file)
            
            # Upload additional context files
            for file in files:
                file_content = await file.read()
                uploaded_file = await self._upload_file_to_gemini(
                    file_content,
                    file.filename,
                    file.content_type or "application/octet-stream"
                )
                uploaded_files.append(uploaded_file)
            
            # Create the prompt
            prompt = self._create_grant_generation_prompt(
                context_text, 
                grant_template_file.filename,
                additional_instructions
            )
            
            # Prepare content for generation
            content = [prompt] + uploaded_files
            
            # Generate the response
            response = await asyncio.to_thread(
                self.model.generate_content,
                content,
                safety_settings=self.safety_settings,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.8,
                    top_k=40,
                    max_output_tokens=8192,
                )
            )
            
            if not response.text:
                raise HTTPException(status_code=500, detail="Failed to generate grant template - empty response")
            
            logger.info("Successfully generated grant template")
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating grant template: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate grant template: {str(e)}")

    def _format_user_context(self, user_context: Dict[str, Any]) -> str:
        """
        Format user context into a readable string
        
        Args:
            user_context: Dictionary containing user information
            
        Returns:
            Formatted context string
        """
        context_parts = []
        
        # Company/Startup Information
        if company_info := user_context.get("company"):
            context_parts.append("## Company Information")
            context_parts.append(f"**Company Name:** {company_info.get('name', 'N/A')}")
            context_parts.append(f"**Industry:** {company_info.get('industry', 'N/A')}")
            context_parts.append(f"**Stage:** {company_info.get('stage', 'N/A')}")
            context_parts.append(f"**Description:** {company_info.get('description', 'N/A')}")
            context_parts.append(f"**Mission:** {company_info.get('mission', 'N/A')}")
            context_parts.append("")
        
        # Founder Information
        if founder_info := user_context.get("founder"):
            context_parts.append("## Founder Information")
            context_parts.append(f"**Name:** {founder_info.get('name', 'N/A')}")
            context_parts.append(f"**Background:** {founder_info.get('background', 'N/A')}")
            context_parts.append(f"**Experience:** {founder_info.get('experience', 'N/A')}")
            context_parts.append(f"**Education:** {founder_info.get('education', 'N/A')}")
            context_parts.append("")
        
        # Project/Grant Specific Information
        if project_info := user_context.get("project"):
            context_parts.append("## Project Information")
            context_parts.append(f"**Project Title:** {project_info.get('title', 'N/A')}")
            context_parts.append(f"**Objective:** {project_info.get('objective', 'N/A')}")
            context_parts.append(f"**Expected Impact:** {project_info.get('impact', 'N/A')}")
            context_parts.append(f"**Timeline:** {project_info.get('timeline', 'N/A')}")
            context_parts.append(f"**Budget Range:** {project_info.get('budget', 'N/A')}")
            context_parts.append("")
        
        # Financial Information
        if financial_info := user_context.get("financial"):
            context_parts.append("## Financial Information")
            context_parts.append(f"**Funding Needed:** {financial_info.get('funding_needed', 'N/A')}")
            context_parts.append(f"**Current Funding:** {financial_info.get('current_funding', 'N/A')}")
            context_parts.append(f"**Revenue Model:** {financial_info.get('revenue_model', 'N/A')}")
            context_parts.append("")
        
        # Additional context
        if additional_context := user_context.get("additional"):
            context_parts.append("## Additional Context")
            for key, value in additional_context.items():
                context_parts.append(f"**{key.replace('_', ' ').title()}:** {value}")
            context_parts.append("")
        
        return "\n".join(context_parts)

    def _create_grant_generation_prompt(
        self, 
        context_text: str, 
        template_filename: str,
        additional_instructions: Optional[str] = None
    ) -> str:
        """
        Create the prompt for grant template generation
        
        Args:
            context_text: Formatted user context
            template_filename: Name of the template file
            additional_instructions: Optional additional instructions
            
        Returns:
            Formatted prompt string
        """
        base_prompt = f"""
You are an expert grant writer specializing in helping startups and founders create compelling grant applications. 

Your task is to generate a comprehensive grant template in markdown format based on the provided context and template inspiration.

**CONTEXT INFORMATION:**
{context_text}

**INSTRUCTIONS:**
1. Use the uploaded file "{template_filename}" as your primary template and structural inspiration
2. Analyze the template structure, sections, and format requirements
3. Generate a new grant application that follows the template's structure but is customized for the specific context provided
4. Fill in relevant sections with information from the context, and provide placeholder guidance where specific details are needed
5. Maintain professional grant writing standards and compelling narrative flow
6. Include all necessary sections typically found in grant applications (executive summary, problem statement, solution, impact, budget, timeline, etc.)
7. Format the output in clean, well-structured markdown
8. Where specific information is not available in the context, provide clear guidance on what information should be filled in

**OUTPUT REQUIREMENTS:**
- Return ONLY the grant template in markdown format
- Ensure the template is ready for immediate use and customization
- Include section headers, bullet points, and proper formatting
- Make it comprehensive but concise
- Focus on creating a compelling narrative that highlights the startup's potential impact

**ADDITIONAL CONTEXT FILES:**
The additional uploaded files contain supplementary information that should be incorporated where relevant to strengthen the grant application.
"""

        if additional_instructions:
            base_prompt += f"\n\n**SPECIAL INSTRUCTIONS:**\n{additional_instructions}"

        return base_prompt

# Example usage function for FastAPI endpoint
async def create_grant_template_endpoint(
    gemini_service: GeminiService,
    user_context: Dict[str, Any],
    files: List[UploadFile],
    grant_template_file: UploadFile,
    additional_instructions: Optional[str] = None
) -> Dict[str, str]:
    """
    FastAPI endpoint wrapper for grant template generation
    
    Args:
        gemini_service: Instance of GeminiService
        user_context: User/startup context information
        files: Additional context files
        grant_template_file: Template file to use as inspiration
        additional_instructions: Optional additional instructions
        
    Returns:
        Dictionary with generated grant template
    """
    try:
        generated_template = await gemini_service.generate_grant_template(
            user_context=user_context,
            files=files,
            grant_template_file=grant_template_file,
            additional_instructions=additional_instructions
        )

        return {
            "status": "success",
            "grant_template": generated_template,
            "message": "Grant template generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
