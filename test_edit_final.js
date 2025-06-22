// Final comprehensive test for Edit button workflow
// This tests the complete flow from Application Editor to Company Info page

console.log('=== Final Edit Button Test ===');

// Complete workflow test
window.finalEditTest = {
    
    // Test 1: Verify we're on the right page
    verifyStartPage: () => {
        console.log('\n1. Verifying start page...');
        const isOnEditor = window.location.pathname === '/application-editor';
        console.log('On Application Editor:', isOnEditor);
        
        if (!isOnEditor) {
            console.log('❌ Not on Application Editor. Navigate to /application-editor first');
            return false;
        }
        
        console.log('✅ On Application Editor page');
        return true;
    },
    
    // Test 2: Check if Edit button exists
    checkEditButton: () => {
        console.log('\n2. Checking Edit button...');
        
        // Look for Edit button in the navigation
        const buttons = document.querySelectorAll('button');
        let editButton = null;
        
        buttons.forEach(btn => {
            if (btn.textContent.includes('Edit')) {
                editButton = btn;
            }
        });
        
        if (editButton) {
            console.log('✅ Edit button found');
            console.log('Button text:', editButton.textContent);
            return editButton;
        } else {
            console.log('❌ Edit button not found');
            console.log('Available buttons:', Array.from(buttons).map(b => b.textContent));
            return null;
        }
    },
    
    // Test 3: Simulate Edit button click
    simulateEditClick: () => {
        console.log('\n3. Simulating Edit button click...');
        
        // Manual simulation of what editCompanyInfo() does
        console.log('Setting currentFormStep to 2...');
        localStorage.setItem('currentFormStep', JSON.stringify(2));
        
        console.log('Clearing grant_analysis_completed...');
        localStorage.removeItem('grant_analysis_completed');
        
        console.log('✅ Edit simulation complete');
        console.log('Now navigate to /application-form to see the result');
        
        return true;
    },
    
    // Test 4: Navigate and verify
    navigateAndVerify: () => {
        console.log('\n4. Navigating to application form...');
        
        // Set up the state first
        localStorage.setItem('currentFormStep', JSON.stringify(2));
        localStorage.removeItem('grant_analysis_completed');
        
        console.log('✅ State prepared');
        console.log('Navigating to /application-form...');
        
        // Navigate
        window.location.href = '/application-form';
    },
    
    // Test 5: Verify result (run this on the form page)
    verifyResult: () => {
        console.log('\n5. Verifying result on form page...');
        
        const isOnForm = window.location.pathname === '/application-form';
        console.log('On Application Form:', isOnForm);
        
        if (!isOnForm) {
            console.log('❌ Not on form page');
            return false;
        }
        
        // Check current step in localStorage
        const currentStep = localStorage.getItem('currentFormStep');
        console.log('Current step in localStorage:', currentStep);
        
        if (currentStep === '2') {
            console.log('✅ Step is correctly set to 2');
        } else {
            console.log('❌ Step is not 2:', currentStep);
        }
        
        // Look for step title
        const headings = document.querySelectorAll('h1, h2, h3, h4');
        let foundCompanyInfo = false;
        
        headings.forEach(h => {
            if (h.textContent.includes('Company Information')) {
                foundCompanyInfo = true;
                console.log('✅ Found Company Information heading:', h.textContent);
            }
        });
        
        if (!foundCompanyInfo) {
            console.log('❌ Company Information heading not found');
            console.log('Available headings:', Array.from(headings).map(h => h.textContent));
        }
        
        return foundCompanyInfo;
    },
    
    // Complete test flow
    runCompleteTest: () => {
        console.log('\n=== Running Complete Test Flow ===');
        
        const step1 = window.finalEditTest.verifyStartPage();
        if (!step1) return false;
        
        const step2 = window.finalEditTest.checkEditButton();
        if (!step2) return false;
        
        const step3 = window.finalEditTest.simulateEditClick();
        if (!step3) return false;
        
        console.log('\n✅ All preliminary tests passed!');
        console.log('Now click the Edit button or run navigateAndVerify()');
        
        return true;
    },
    
    // Quick manual test
    quickManualTest: () => {
        console.log('\n=== Quick Manual Test ===');
        console.log('1. Ensure you are on /application-editor');
        console.log('2. Open browser console');
        console.log('3. Run: finalEditTest.simulateEditClick()');
        console.log('4. Click the Edit button');
        console.log('5. Verify you land on Company Information page');
        
        // Run the simulation
        window.finalEditTest.simulateEditClick();
        
        console.log('\n✅ Setup complete - now click the Edit button!');
    }
};

console.log('\nAvailable test functions:');
console.log('finalEditTest.verifyStartPage() - Check current page');
console.log('finalEditTest.checkEditButton() - Find Edit button');
console.log('finalEditTest.simulateEditClick() - Simulate click');
console.log('finalEditTest.navigateAndVerify() - Navigate and check');
console.log('finalEditTest.verifyResult() - Verify on form page');
console.log('finalEditTest.runCompleteTest() - Run all tests');
console.log('finalEditTest.quickManualTest() - Quick manual test');

console.log('\n=== Current Status ===');
console.log('URL:', window.location.href);
console.log('Path:', window.location.pathname);

// Auto-run basic check
if (window.location.pathname === '/application-editor') {
    console.log('\n=== Auto-running basic checks ===');
    window.finalEditTest.verifyStartPage();
    window.finalEditTest.checkEditButton();
} else if (window.location.pathname === '/application-form') {
    console.log('\n=== Auto-running form verification ===');
    window.finalEditTest.verifyResult();
}
