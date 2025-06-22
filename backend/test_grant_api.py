#!/usr/bin/env python3
"""
Test script for the Grant Application Generation API
"""
import asyncio
import json
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, '/Volumes/T9/Developer/Developer/Code/GrantApplicationWriter/backend')

async def test_grant_generation():
    """Test the grant application generation functionality"""
    try:
        # Test data
        test_company_data = {
            "companyInfo": {
                "companyName": "LazyGrant Technologies Inc.",
                "description": "AI-powered grant application assistant platform for startups",
                "address": "123 Innovation Drive, San Francisco, CA 94105",
                "email": "contact@lazygrant.com",
                "phone": "(555) 123-4567",
                "employeeCount": "5-10",
                "annualRevenue": "$100K-$500K",
                "industry": "Software/AI",
                "website": "https://lazygrant.com"
            },
            "selectedTemplate": {
                "title": "SBIR Phase I",
                "agency": "NSF",
                "amount": "$275,000",
                "duration": "6 months",
                "category": "Artificial Intelligence"
            },
            "questionAnswers": {
                "projectTitle": "AI-Powered Grant Application Assistant Platform",
                "technicalInnovation": "Advanced LLM-based grant writing assistance with form parsing capabilities",
                "problemStatement": "85% of startup founders abandon grant applications due to complexity and time constraints",
                "targetMarket": "Early-stage startups seeking non-dilutive government funding",
                "competitiveAdvantage": "First AI-native platform specifically designed for grant writing workflows"
            }
        }
        
        # Import and test the service directly
        from app.services.gemini_service import GeminiService
        
        # Test API key validation first
        print("Testing GeminiService initialization...")
        try:
            gemini_service = GeminiService()
            print("✓ GeminiService initialized successfully")
        except Exception as e:
            print(f"✗ GeminiService initialization failed: {e}")
            return
        
        # Read the prompt template
        prompt_path = "/Volumes/T9/Developer/Developer/Code/GrantApplicationWriter/backend/prompt.txt"
        print(f"Reading prompt template from: {prompt_path}")
        
        if not os.path.exists(prompt_path):
            print("✗ Prompt template file not found")
            return
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            base_prompt = f.read()
        
        print(f"✓ Prompt template loaded ({len(base_prompt)} characters)")
        
        # Test prompt building
        print("Testing prompt building...")
        try:
            complete_prompt = gemini_service.build_prompt(base_prompt, test_company_data)
            print(f"✓ Prompt built successfully ({len(complete_prompt)} characters)")
        except Exception as e:
            print(f"✗ Prompt building failed: {e}")
            return
        
        # Note: We won't test the actual API call without a valid API key
        print("\n✓ All tests passed! The service is ready to use.")
        print("\nTo test with a real API key:")
        print("1. Set the GEMINI_API_KEY environment variable")
        print("2. Run the server: uvicorn app.main:app --reload")
        print("3. Test the endpoint: POST http://localhost:8000/api/v1/generate-grant-application")
        
    except Exception as e:
        print(f"✗ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_grant_generation())
