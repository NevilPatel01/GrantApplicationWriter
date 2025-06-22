# Frontend Integration Guide - Grant Application Generator

## Overview
The frontend has been successfully integrated with the Gemini AI backend to generate professional grant applications. Users can now:

1. Fill out the form with company information
2. Generate AI-powered grant applications
3. Edit and refine the generated content
4. Export as TXT or PDF files

## New Features Added

### 1. GrantGenerationService (`src/services/GrantGenerationService.js`)
- **API Communication**: Handles all backend API calls
- **Data Transformation**: Converts frontend form data to API format
- **File Export**: Save generated content as TXT files
- **Progress Tracking**: Real-time generation progress updates

### 2. Enhanced ApplicationEditor (`src/pages/ApplicationEditor.jsx`)
- **AI Generation Button**: "Generate with AI" button in the toolbar
- **Progress Indicator**: Visual progress bar during generation
- **Status Messages**: Real-time status updates
- **Success Indicator**: Confirmation when AI generation completes
- **File Export**: Save as TXT option in export menu

## User Workflow

### Step 1: Complete the Grant Application Form
1. Navigate to `/application-form`
2. Fill out company information:
   - Company name, description, contact details
   - Employee count, revenue, industry
   - Project-specific questions
3. Select grant template (SBIR, NSF, etc.)
4. Complete all required fields

### Step 2: Generate with AI
1. Navigate to `/application-editor`
2. Click the purple "Generate with AI" button
3. Watch the progress indicator:
   - "Validating API connection..."
   - "Preparing company data..."
   - "Generating grant application with AI..."
   - "Finalizing document..."
4. See the AI-generated content replace the template

### Step 3: Review and Export
1. Review the generated grant application
2. Use text selection to make AI-powered edits
3. Export options:
   - **Save as TXT**: Download as text file
   - **Export as PDF**: Generate PDF document
   - **Copy to Clipboard**: Copy markdown content

## API Integration Details

### Data Flow
```
Form Data → GrantGenerationService → Backend API → Gemini AI → Generated Content
```

### Request Format
```javascript
{
  companyInfo: {
    companyName: "LazyGrant Technologies Inc.",
    description: "AI-powered grant application assistant",
    address: "123 Innovation Drive, San Francisco, CA",
    email: "contact@lazygrant.com",
    phone: "(555) 123-4567",
    employeeCount: "5-10",
    annualRevenue: "$100K-$500K",
    industry: "Software/AI",
    website: "https://lazygrant.com"
  },
  selectedTemplate: {
    title: "SBIR Phase I",
    agency: "NSF",
    amount: "$275,000",
    duration: "6 months",
    category: "Artificial Intelligence"
  },
  questionAnswers: {
    projectTitle: "AI Grant Assistant Platform",
    technicalInnovation: "LLM-based grant writing...",
    // ... other answers
  }
}
```

### Response Format
```javascript
{
  status: "success",
  generated_application: "# Grant Application...", // Full markdown content
  message: "Grant application generated successfully"
}
```

## Technical Implementation

### Service Architecture
```
ApplicationEditor.jsx
    ↓ calls
GrantGenerationService.js
    ↓ HTTP POST
Backend API (/api/v1/generate-grant-application)
    ↓ processes
GeminiService.py
    ↓ calls
Google Gemini AI API
```

### Error Handling
- **API Key Validation**: Checks if Gemini API is configured
- **Network Errors**: Handles connection failures gracefully
- **Data Validation**: Ensures required form data is present
- **User Feedback**: Clear error messages and recovery suggestions

### Progress Tracking
```javascript
const phases = [
  { message: "Validating API connection...", progress: 10 },
  { message: "Preparing company data...", progress: 20 },
  { message: "Generating with AI...", progress: 40 },
  { message: "Finalizing document...", progress: 90 },
  { message: "Complete!", progress: 100 }
];
```

## Configuration

### Backend URL Configuration
The service automatically detects the backend URL:
```javascript
// Default: http://localhost:8000
// Production: Set via environment or auto-detect
```

### API Key Setup
1. Set `GEMINI_API_KEY` in backend `.env` file
2. Restart the backend server
3. Frontend will validate the connection automatically

## Usage Examples

### Basic Generation
```javascript
import GrantGenerationService from '../services/GrantGenerationService';

// Generate grant application
const generatedContent = await GrantGenerationService.generateGrantApplication({
  companyInfo: { /* company data */ },
  selectedTemplate: { /* template info */ },
  questionAnswers: { /* Q&A responses */ }
});
```

### With Progress Tracking
```javascript
const content = await GrantGenerationService.generateWithProgress(
  formData,
  (status, progress) => {
    console.log(`${status} - ${progress}%`);
  }
);
```

### File Export
```javascript
// Save as TXT file
GrantGenerationService.saveAsFile(
  content, 
  "LazyGrant Technologies", 
  "txt"
);
```

## UI/UX Features

### Visual Indicators
- **Loading States**: Spinner and progress bar during generation
- **Success Feedback**: Green checkmark when complete
- **Error States**: Red error messages with retry options
- **Disabled States**: Button disabled when form incomplete

### Responsive Design
- Mobile-friendly button layout
- Adaptive progress indicators
- Touch-friendly interface elements

### Accessibility
- Screen reader compatible
- Keyboard navigation support
- High contrast indicators
- ARIA labels for status updates

## Performance Considerations

### Generation Time
- Typical generation: 10-30 seconds
- Complex applications: Up to 60 seconds
- Progress updates every 2-3 seconds

### File Size Limits
- Generated content: ~20-50KB typical
- TXT export: Immediate download
- PDF export: May take additional processing time

### Concurrent Users
- Service handles multiple simultaneous requests
- No user-specific state stored in service
- Each generation is independent

## Future Enhancements

### Planned Features
1. **PDF Export**: Direct PDF generation and download
2. **Content Templates**: Pre-built section templates
3. **Collaboration**: Multi-user editing and comments
4. **Version History**: Track changes and revisions
5. **Auto-save**: Periodic saving of generated content

### Integration Opportunities
1. **Document Management**: Integration with Google Drive, Dropbox
2. **Grant Databases**: Integration with government grant portals
3. **Analytics**: Track application success rates
4. **Payment Processing**: Premium features and services

## Troubleshooting

### Common Issues

#### "Generate with AI" button disabled
- **Cause**: Form data not complete
- **Solution**: Complete the grant application form first

#### "API key validation failed"
- **Cause**: Backend not configured properly
- **Solution**: Check backend logs, verify GEMINI_API_KEY

#### Generation takes too long
- **Cause**: Large/complex application data
- **Solution**: Simplify company description, check network

#### Content not displaying
- **Cause**: API response format issues
- **Solution**: Check browser console, verify backend version

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('grant_debug', 'true');

// Check service status
const isValid = await GrantGenerationService.validateApiKey();
console.log('API Status:', isValid);
```

## Testing

### Test the Integration
1. **Start Backend**: `cd backend && uvicorn app.main:app --reload`
2. **Start Frontend**: `cd frontend && npm start`
3. **Complete Form**: Fill out application form with test data
4. **Generate**: Click "Generate with AI" and verify output
5. **Export**: Test TXT file download functionality

### Sample Test Data
```javascript
const testData = {
  companyInfo: {
    companyName: "Test Startup Inc.",
    description: "Innovative AI solutions for small businesses",
    email: "test@example.com",
    industry: "Technology"
  },
  selectedTemplate: {
    title: "SBIR Phase I",
    agency: "NSF",
    amount: "$275,000"
  },
  questionAnswers: {
    projectTitle: "AI Business Assistant Platform"
  }
};
```

## Support

For questions or issues:
1. Check browser console for error messages
2. Verify backend server is running (http://localhost:8000/docs)
3. Ensure form data is complete before generation
4. Test API connectivity with validation endpoint

## Success Metrics

The integration is successful when:
- ✅ Form data loads properly in ApplicationEditor
- ✅ "Generate with AI" button is enabled with form data
- ✅ Progress indicator shows during generation
- ✅ Generated content replaces template content
- ✅ TXT file download works correctly
- ✅ Error handling displays helpful messages

This completes the frontend integration with the Gemini AI backend!
