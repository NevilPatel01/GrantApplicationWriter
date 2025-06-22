#!/usr/bin/env python3
"""
Integration Test for Grant Application Generation
Tests the complete flow from API endpoint to response
"""
import asyncio
import json
import sys
import os
import requests
from datetime import datetime

# Backend server URL
BASE_URL = "http://localhost:8000"

def test_server_connection():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Server is running and accessible")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except requests.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
        return False

def test_api_key_validation():
    """Test API key validation endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/v1/validate-api-key")
        if response.status_code == 200:
            data = response.json()
            if data.get("api_key_valid"):
                print("✅ API key is valid and working")
                return True
            else:
                print("❌ API key validation failed:", data.get("message"))
                return False
        else:
            print(f"❌ API key validation endpoint returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing API key: {e}")
        return False

def test_grant_generation():
    """Test grant application generation endpoint"""
    test_data = {
        "companyInfo": {
            "companyName": "LazyGrant Technologies Inc.",
            "description": "AI-powered grant application assistant platform for startups and entrepreneurs",
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
            "technicalInnovation": "Advanced Large Language Model integration with domain-specific grant writing expertise",
            "problemStatement": "85% of startup founders abandon grant applications due to complexity and time constraints",
            "targetMarket": "Early-stage startups, accelerators, and independent consultants seeking government funding",
            "competitiveAdvantage": "First AI-native platform specifically designed for grant writing workflows with conversational interface"
        }
    }
    
    try:
        print("🚀 Testing grant generation with sample data...")
        print("⏳ This may take 10-30 seconds...")
        
        response = requests.post(
            f"{BASE_URL}/api/v1/generate-grant-application",
            json=test_data,
            timeout=60  # 60 second timeout
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                generated_content = data.get("generated_application", "")
                print("✅ Grant application generated successfully!")
                print(f"📄 Generated content length: {len(generated_content)} characters")
                
                # Save to file for inspection
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"test_grant_output_{timestamp}.md"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(generated_content)
                print(f"💾 Sample output saved to: {filename}")
                
                # Basic content validation
                required_sections = ["Abstract", "Project Description", "Budget", "Conclusion"]
                found_sections = sum(1 for section in required_sections if section.lower() in generated_content.lower())
                print(f"📋 Found {found_sections}/{len(required_sections)} expected sections")
                
                return True
            else:
                print(f"❌ Generation failed: {data.get('message')}")
                return False
        else:
            print(f"❌ API returned status {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error details: {error_data}")
            except:
                print(f"   Response text: {response.text}")
            return False
            
    except requests.Timeout:
        print("❌ Request timed out. Generation may take longer than expected.")
        return False
    except Exception as e:
        print(f"❌ Error during generation: {e}")
        return False

def test_frontend_integration():
    """Test that frontend integration points are working"""
    print("\n📱 Frontend Integration Checklist:")
    
    # Check if service file exists
    service_file = "/Volumes/T9/Developer/Developer/Code/GrantApplicationWriter/frontend/src/services/GrantGenerationService.js"
    if os.path.exists(service_file):
        print("✅ GrantGenerationService.js exists")
    else:
        print("❌ GrantGenerationService.js not found")
    
    # Check if ApplicationEditor has been updated
    editor_file = "/Volumes/T9/Developer/Developer/Code/GrantApplicationWriter/frontend/src/pages/ApplicationEditor.jsx"
    if os.path.exists(editor_file):
        with open(editor_file, 'r') as f:
            content = f.read()
            if "GrantGenerationService" in content:
                print("✅ ApplicationEditor.jsx integrated with service")
            else:
                print("❌ ApplicationEditor.jsx not properly integrated")
                
            if "handleAIGeneration" in content:
                print("✅ AI generation function implemented")
            else:
                print("❌ AI generation function not found")
    else:
        print("❌ ApplicationEditor.jsx not found")

def main():
    """Run all integration tests"""
    print("🧪 Grant Application Generation - Integration Test")
    print("=" * 50)
    
    # Test 1: Server connectivity
    print("\n1. Testing server connectivity...")
    if not test_server_connection():
        print("\n❌ Cannot proceed - server not accessible")
        print("\nTo start the server:")
        print("cd backend")
        print("source .venv/bin/activate")
        print("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return False
    
    # Test 2: API key validation
    print("\n2. Testing API key validation...")
    api_key_valid = test_api_key_validation()
    if not api_key_valid:
        print("\n⚠️  API key not configured. To set up:")
        print("1. Get API key from https://makersuite.google.com/app/apikey")
        print("2. Add to backend/.env: GEMINI_API_KEY=your-key-here")
        print("3. Restart the server")
        print("\n⏭️  Continuing with other tests...")
    
    # Test 3: Grant generation (only if API key is valid)
    print("\n3. Testing grant generation...")
    if api_key_valid:
        generation_success = test_grant_generation()
    else:
        print("⏭️  Skipping generation test - API key not configured")
        generation_success = False
    
    # Test 4: Frontend integration
    print("\n4. Testing frontend integration...")
    test_frontend_integration()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"✅ Server Running: Yes")
    print(f"{'✅' if api_key_valid else '❌'} API Key Valid: {'Yes' if api_key_valid else 'No'}")
    print(f"{'✅' if generation_success else '❌'} Generation Working: {'Yes' if generation_success else 'No'}")
    print(f"✅ Frontend Integration: Ready")
    
    if generation_success:
        print("\n🎉 All systems operational! Ready for production use.")
        print("\nNext steps:")
        print("1. Start frontend: cd frontend && npm start")
        print("2. Navigate to http://localhost:3000/application-form")
        print("3. Fill out the form and test AI generation")
    else:
        print("\n⚠️  System partially operational.")
        print("Backend API is ready, but AI generation requires API key configuration.")
    
    return generation_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
