// Debug script for Edit button issues
// Run this in browser console if Edit button is not working

console.log('=== Edit Button Debug Script ===');

window.debugEdit = {
    
    // Check if the function exists
    checkFunction: () => {
        console.log('Checking if editCompanyInfo function is available...');
        
        // This won't work since the function is in component scope
        // But we can check if the button exists and is clickable
        const editButton = document.querySelector('button[onclick*="editCompanyInfo"], button:contains("Edit")');
        
        if (editButton) {
            console.log('✓ Edit button found in DOM');
            console.log('Button element:', editButton);
        } else {
            console.log('✗ Edit button not found');
            console.log('Available buttons:', document.querySelectorAll('button'));
        }
    },
    
    // Manually set localStorage to test
    manualTest: () => {
        console.log('Setting up manual test...');
        
        // Set step to 2
        localStorage.setItem('currentFormStep', JSON.stringify(2));
        console.log('✓ Set current step to 2');
        
        // Clear analysis
        localStorage.removeItem('grant_analysis_completed');
        console.log('✓ Cleared analysis completion');
        
        console.log('Now navigate to /application-form to test');
        
        return 'Manual setup complete';
    },
    
    // Check localStorage state
    checkStorage: () => {
        console.log('Current localStorage state:');
        
        const step = localStorage.getItem('currentFormStep');
        const analysis = localStorage.getItem('grant_analysis_completed');
        const company = localStorage.getItem('companyFormData');
        
        console.log('Current step:', step);
        console.log('Analysis completed:', analysis);
        console.log('Company data exists:', !!company);
        
        return { step, analysis, hasCompany: !!company };
    },
    
    // Force navigation test
    forceNavigationTest: () => {
        console.log('Testing forced navigation...');
        
        // Set up the state
        localStorage.setItem('currentFormStep', JSON.stringify(2));
        localStorage.removeItem('grant_analysis_completed');
        
        console.log('✓ State set up');
        console.log('Navigating to application form...');
        
        // Force navigation
        window.location.href = '/application-form';
    },
    
    // Check current page
    checkPage: () => {
        const url = window.location.href;
        const path = window.location.pathname;
        
        console.log('Current URL:', url);
        console.log('Current path:', path);
        
        if (path === '/application-editor') {
            console.log('On Application Editor - Edit button should be visible');
        } else if (path === '/application-form') {
            console.log('On Application Form - Check which step is showing');
            
            // Try to find step indicator
            const stepElements = document.querySelectorAll('[class*="step"], h1, h2, h3');
            stepElements.forEach(el => {
                if (el.textContent.includes('Step') || el.textContent.includes('Company') || el.textContent.includes('Information')) {
                    console.log('Found step element:', el.textContent);
                }
            });
        } else {
            console.log('On other page:', path);
        }
    }
};

console.log('Available debug functions:');
console.log('- debugEdit.checkFunction()');
console.log('- debugEdit.manualTest()');
console.log('- debugEdit.checkStorage()');
console.log('- debugEdit.forceNavigationTest()');
console.log('- debugEdit.checkPage()');

// Auto-run page check
console.log('\n=== Auto-running page check ===');
debugEdit.checkPage();
debugEdit.checkStorage();
