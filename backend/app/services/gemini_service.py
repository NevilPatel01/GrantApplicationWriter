"""
Gemini AI Service for Grant Application Generation
"""
import os
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        """Initialize Gemini service with API key from environment."""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-pro-latest",
            generation_config={
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 8192,
            },
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            }
        )
    
    def build_prompt(self, base_prompt: str, company_data: Dict[str, Any]) -> str:
        """
        Build the complete prompt by filling in company data placeholders.
        
        Args:
            base_prompt: The base prompt template
            company_data: Company information and form data
            
        Returns:
            Complete prompt with company data filled in
        """
        try:
            # Extract data from the nested structure
            company_info = company_data.get('companyInfo', {})
            selected_template = company_data.get('selectedTemplate', {})
            question_answers = company_data.get('questionAnswers', {})
            
            # Build company details section
            company_details = f"""
**COMPANY INFORMATION:**
- Company Name: {company_info.get('companyName', 'Not provided')}
- Mission/Description: {company_info.get('description', 'Not provided')}
- Address: {company_info.get('address', 'Not provided')}
- Email: {company_info.get('email', 'Not provided')}
- Phone: {company_info.get('phone', 'Not provided')}
- Employee Count: {company_info.get('employeeCount', 'Not provided')}
- Annual Revenue: {company_info.get('annualRevenue', 'Not provided')}
- Industry: {company_info.get('industry', 'Not provided')}
- Website: {company_info.get('website', 'Not provided')}

**GRANT PROGRAM INFORMATION:**
- Program: {selected_template.get('title', 'SBIR Phase I')}
- Funding Agency: {selected_template.get('agency', 'NSF')}
- Award Amount: {selected_template.get('amount', '$275,000')}
- Duration: {selected_template.get('duration', '6-12 months')}
- Program Focus: {selected_template.get('category', 'Technology Innovation')}

**PROJECT DETAILS:**
"""
            
            # Add question answers if available
            if question_answers:
                for question_id, answer in question_answers.items():
                    if answer and str(answer).strip():
                        company_details += f"- {question_id}: {answer}\n"
            
            # Add supporting documents info if available
            documents = company_info.get('documents', [])
            if documents:
                company_details += f"\n**SUPPORTING DOCUMENTS:**\n"
                for i, doc in enumerate(documents, 1):
                    doc_name = doc.get('name', f'Document {i}')
                    doc_type = doc.get('type', 'Unknown')
                    company_details += f"- {doc_name} ({doc_type})\n"
            
            # Replace the placeholder in the base prompt
            complete_prompt = base_prompt.replace(
                "[Insert Company Details Here - See Template Below]",
                company_details
            )
            
            return complete_prompt
            
        except Exception as e:
            logger.error(f"Error building prompt: {str(e)}")
            raise ValueError(f"Failed to build prompt: {str(e)}")
    
    async def generate_grant_application(
        self, 
        base_prompt: str, 
        company_data: Dict[str, Any]
    ) -> str:
        """
        Generate a grant application using Gemini AI.
        
        Args:
            base_prompt: The base prompt template
            company_data: Company information and form data
            
        Returns:
            Generated grant application content
        """
        try:
            # Build the complete prompt
            complete_prompt = self.build_prompt(base_prompt, company_data)
            
            logger.info("Generating grant application with Gemini AI")
            logger.debug(f"Prompt length: {len(complete_prompt)} characters")
            
            # Generate content using Gemini
            response = await self._generate_content_async(complete_prompt)
            
            if not response or not response.text:
                raise ValueError("Empty response from Gemini API")
            
            logger.info("Grant application generated successfully")
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating grant application: {str(e)}")
            raise ValueError(f"Failed to generate grant application: {str(e)}")
    
    async def _generate_content_async(self, prompt: str):
        """
        Generate content asynchronously using Gemini.
        
        Args:
            prompt: The complete prompt to send to Gemini
            
        Returns:
            Gemini response object
        """
        try:
            # Use the synchronous method but wrap it for async
            # Note: google-generativeai doesn't have native async support yet
            import asyncio
            
            def _sync_generate():
                return self.model.generate_content(prompt)
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, _sync_generate)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in Gemini API call: {str(e)}")
            raise
    
    def validate_api_key(self) -> bool:
        """
        Validate that the API key is working.
        
        Returns:
            True if API key is valid, False otherwise
        """
        try:
            # Simple test call
            test_response = self.model.generate_content("Hello")
            return bool(test_response and test_response.text)
        except Exception as e:
            logger.error(f"API key validation failed: {str(e)}")
            return False
