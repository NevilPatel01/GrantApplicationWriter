/**
 * Grant Generation API Service
 * Handles communication with the backend API for grant application generation
 */

class GrantGenerationService {
    constructor() {
        // Use window.location for default URL in browser environment
        this.baseURL = (typeof window !== 'undefined' && window.location) 
            ? `${window.location.protocol}//${window.location.hostname}:8000`
            : 'http://localhost:8000';
    }

    /**
     * Generate a grant application using company data
     * @param {Object} companyData - Company information and form data
     * @returns {Promise<string>} Generated grant application content
     */
    async generateGrantApplication(companyData) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/generate-grant-application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status !== 'success') {
                throw new Error(result.message || 'Grant generation failed');
            }

            return result.generated_application;
        } catch (error) {
            console.error('Error generating grant application:', error);
            throw new Error(`Failed to generate grant application: ${error.message}`);
        }
    }

    /**
     * Validate the API key configuration
     * @returns {Promise<boolean>} True if API key is valid
     */
    async validateApiKey() {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/validate-api-key`);
            
            if (!response.ok) {
                return false;
            }

            const result = await response.json();
            return result.api_key_valid === true;
        } catch (error) {
            console.error('Error validating API key:', error);
            return false;
        }
    }

    /**
     * Transform form data from frontend format to API format
     * @param {Object} formData - Form data from AsyncStorage
     * @returns {Object} Transformed data for API
     */
    transformFormDataForAPI(formData) {
        const { companyInfo, selectedTemplate, questionAnswers } = formData || {};

        return {
            companyInfo: {
                companyName: companyInfo?.companyName || '',
                description: companyInfo?.description || '',
                address: companyInfo?.address || '',
                email: companyInfo?.email || '',
                phone: companyInfo?.phone || '',
                employeeCount: companyInfo?.employeeCount || '',
                annualRevenue: companyInfo?.annualRevenue || '',
                industry: companyInfo?.industry || '',
                website: companyInfo?.website || ''
            },
            selectedTemplate: {
                title: selectedTemplate?.title || 'SBIR Phase I',
                agency: selectedTemplate?.agency || 'NSF',
                amount: selectedTemplate?.amount || '$275,000',
                duration: selectedTemplate?.duration || '6 months',
                category: selectedTemplate?.category || 'Technology Innovation'
            },
            questionAnswers: questionAnswers || {}
        };
    }

    /**
     * Save generated content as file
     * @param {string} content - Generated grant application content
     * @param {string} companyName - Company name for filename
     * @param {string} format - File format ('txt' or 'pdf')
     */
    saveAsFile(content, companyName, format = 'txt') {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const filename = `grant_application_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${format}`;

        if (format === 'txt') {
            // Create and download text file
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (format === 'pdf') {
            // For PDF, we would need additional libraries or send to backend
            console.log('PDF export would be implemented here');
            alert('PDF export feature coming soon! Use TXT format for now.');
        }
    }

    /**
     * Generate grant application with error handling and user feedback
     * @param {Object} formData - Form data from frontend
     * @param {Function} onProgress - Progress callback function
     * @returns {Promise<string>} Generated content
     */
    async generateWithProgress(formData, onProgress) {
        try {
            // Validate API connection first
            if (onProgress) onProgress('Validating API connection...', 10);
            
            const isValidKey = await this.validateApiKey();
            if (!isValidKey) {
                throw new Error('API key validation failed. Please check server configuration.');
            }

            // Transform data
            if (onProgress) onProgress('Preparing company data...', 20);
            const apiData = this.transformFormDataForAPI(formData);

            // Generate content
            if (onProgress) onProgress('Generating grant application with AI...', 40);
            const generatedContent = await this.generateGrantApplication(apiData);

            if (onProgress) onProgress('Finalizing document...', 90);
            
            // Brief delay to show completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (onProgress) onProgress('Complete!', 100);
            
            return generatedContent;
        } catch (error) {
            if (onProgress) onProgress(`Error: ${error.message}`, 0);
            throw error;
        }
    }
}

// Create and export a singleton instance
const grantGenerationService = new GrantGenerationService();
export default grantGenerationService;
