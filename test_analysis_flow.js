// Test script to verify the Advanced Data Analysis flow
// Run this in the browser console on the ApplicationEditor page

console.log('=== Testing Advanced Data Analysis Flow ===');

// Check current state
const analysisCompleted = localStorage.getItem('grant_analysis_completed');
console.log('Current analysis completion status:', analysisCompleted);

// Check if form data exists
const formData = localStorage.getItem('companyFormData');
console.log('Form data exists:', formData ? 'Yes' : 'No');

// Test functions
console.log('\n=== Available Test Functions ===');
console.log('1. resetAnalysisCompletion() - Reset the analysis completion flag');
console.log('2. localStorage.getItem("grant_analysis_completed") - Check completion status');
console.log('3. localStorage.setItem("grant_analysis_completed", "true") - Mark as completed');

console.log('\n=== Test Instructions ===');
console.log('1. Navigate from /application-form to /application-editor - should show analysis');
console.log('2. Refresh /application-editor page - should NOT show analysis');
console.log('3. Run resetAnalysisCompletion() then refresh - should show analysis again');

// If you want to test right now:
console.log('\n=== Quick Test ===');
console.log('Run the following to test:');
console.log('resetAnalysisCompletion(); window.location.reload();');
