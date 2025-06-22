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
     * @param {Element} elementForPdf - DOM element to convert to PDF (required for PDF format)
     * @returns {Promise<{success: boolean, message: string, filename?: string}>}
     */
    async saveAsFile(content, companyName, format = 'txt', elementForPdf = null) {
        try {
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

                return {
                    success: true,
                    message: 'Text file downloaded successfully!',
                    filename: filename
                };

            } else if (format === 'pdf') {
                if (!elementForPdf) {
                    throw new Error('DOM element required for PDF generation');
                }

                // Import jsPDF and html2canvas dynamically
                const jsPDF = (await import('jspdf')).default;
                const html2canvas = (await import('html2canvas')).default;

                // Generate canvas from DOM element
                const canvas = await html2canvas(elementForPdf, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    height: elementForPdf.scrollHeight,
                    width: elementForPdf.scrollWidth
                });

                // Create PDF
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 30;

                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(filename);

                return {
                    success: true,
                    message: 'PDF downloaded successfully!',
                    filename: filename
                };
            }

            throw new Error(`Unsupported format: ${format}`);

        } catch (error) {
            console.error('Error saving file:', error);
            return {
                success: false,
                message: `Failed to save ${format.toUpperCase()} file: ${error.message}`
            };
        }
    }

    /**
     * Copy content to clipboard
     * @param {string} content - Content to copy
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async copyToClipboard(content) {
        try {
            if (!navigator.clipboard) {
                // Fallback for browsers that don't support navigator.clipboard
                const textArea = document.createElement('textarea');
                textArea.value = content;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            } else {
                await navigator.clipboard.writeText(content);
            }

            return {
                success: true,
                message: 'Content copied to clipboard successfully!'
            };
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            return {
                success: false,
                message: 'Failed to copy to clipboard. Please try again.'
            };
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
