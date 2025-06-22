# Grant Application Generation API - Setup Guide

## Overview
This implementation provides a FastAPI backend endpoint that integrates with Google's Gemini AI to generate professional grant applications using company data and a prompt template.

## Implementation Details

### New Files Created:
1. **`app/api/routes/v1/grants.py`** - New API endpoint for grant generation
2. **`app/services/gemini_service.py`** - Gemini AI service integration
3. **`backend/prompt.txt`** - Grant writing prompt template
4. **`.env.example`** - Environment configuration template
5. **`test_grant_api.py`** - Test script for validation

### API Endpoints:
- **POST** `/api/v1/generate-grant-application` - Generate grant application
- **GET** `/api/v1/validate-api-key` - Validate Gemini API key

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:
```bash
cp .env.example .env
```

Edit `.env` and set your Gemini API key:
```bash
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 3. Start the Server
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Test the API

#### Test API Key Validation:
```bash
curl http://localhost:8000/api/v1/validate-api-key
```

#### Test Grant Generation:
```bash
curl -X POST http://localhost:8000/api/v1/generate-grant-application \
  -H "Content-Type: application/json" \
  -d '{
    "companyInfo": {
      "companyName": "LazyGrant Technologies Inc.",
      "description": "AI-powered grant application assistant platform",
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
      "technicalInnovation": "Advanced LLM-based grant writing assistance",
      "problemStatement": "85% of startup founders abandon grant applications",
      "targetMarket": "Early-stage startups seeking government funding"
    }
  }'
```

## API Request/Response Format

### Request Body:
```json
{
  "companyInfo": {
    "companyName": "string",
    "description": "string",
    "address": "string",
    "email": "string",
    "phone": "string",
    "employeeCount": "string",
    "annualRevenue": "string",
    "industry": "string",
    "website": "string"
  },
  "selectedTemplate": {
    "title": "string",
    "agency": "string", 
    "amount": "string",
    "duration": "string",
    "category": "string"
  },
  "questionAnswers": {
    "key": "value"
  }
}
```

### Response:
```json
{
  "status": "success",
  "generated_application": "Full grant application text in markdown format...",
  "message": "Grant application generated successfully"
}
```

## File Storage (Future Enhancement)

The current implementation returns the generated grant application as text. To save as files:

### For TXT files:
```python
# Save to file
import os
from datetime import datetime

def save_grant_as_txt(content: str, company_name: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"grant_application_{company_name}_{timestamp}.txt"
    filepath = os.path.join("generated_grants", filename)
    
    os.makedirs("generated_grants", exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return filepath
```

### For PDF files:
```python
# Install: pip install reportlab markdown
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import markdown

def save_grant_as_pdf(content: str, company_name: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"grant_application_{company_name}_{timestamp}.pdf"
    filepath = os.path.join("generated_grants", filename)
    
    os.makedirs("generated_grants", exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Convert markdown to HTML, then to PDF
    html_content = markdown.markdown(content)
    paragraphs = html_content.split('<p>')
    
    for para in paragraphs:
        if para.strip():
            clean_text = para.replace('</p>', '').strip()
            if clean_text:
                story.append(Paragraph(clean_text, styles['Normal']))
                story.append(Spacer(1, 12))
    
    doc.build(story)
    return filepath
```

## Integration with Frontend

The frontend can call this endpoint like this:

```javascript
async function generateGrantApplication(companyData) {
  try {
    const response = await fetch('/api/v1/generate-grant-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData)
    });
    
    if (!response.ok) {
      throw new Error('Grant generation failed');
    }
    
    const result = await response.json();
    return result.generated_application;
  } catch (error) {
    console.error('Error generating grant:', error);
    throw error;
  }
}
```

## Error Handling

The API includes comprehensive error handling:
- API key validation
- Input validation
- Gemini API errors
- File I/O errors
- Proper HTTP status codes

## Security Considerations

1. **API Key Security**: API key is stored in environment variables
2. **Input Validation**: All inputs are validated using Pydantic models
3. **Error Logging**: Comprehensive logging for debugging
4. **Rate Limiting**: Consider adding rate limiting for production use

## Performance Considerations

1. **Response Time**: Grant generation takes 10-30 seconds depending on complexity
2. **Token Limits**: Gemini has token limits (~8K output tokens)
3. **Concurrent Requests**: Service can handle multiple concurrent requests
4. **Caching**: Consider caching similar requests for better performance

## Next Steps

1. ✅ Set up your Gemini API key
2. ✅ Test the API endpoints
3. 🔄 Integrate with frontend
4. 📋 Add file saving functionality (TXT/PDF)
5. 📋 Enhance prompt template based on feedback
6. 📋 Add more grant program templates
7. 📋 Implement user authentication if needed

## Troubleshooting

### Common Issues:

1. **"GEMINI_API_KEY environment variable is required"**
   - Solution: Set your API key in the `.env` file

2. **"API key validation failed"**
   - Solution: Check that your API key is valid and has proper permissions

3. **"Prompt template file not found"**
   - Solution: Ensure `prompt.txt` exists in the backend directory

4. **Import errors**
   - Solution: Make sure all dependencies are installed: `pip install -r requirements.txt`

5. **Server won't start**
   - Solution: Check for syntax errors and ensure virtual environment is activated

## Support

For questions or issues:
1. Check the logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with the provided test script: `python test_grant_api.py`
