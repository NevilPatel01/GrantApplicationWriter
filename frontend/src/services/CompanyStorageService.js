import AsyncStorage from '../utils/AsyncStorage';
import FileManager from '../utils/fileManager';

/**
 * Company Information Storage Service
 * Manages storing and retrieving company information and form data using AsyncStorage
 */
class CompanyStorageService {
    // Storage keys
    static KEYS = {
        COMPANY_INFO: 'company_information',
        SELECTED_TEMPLATE: 'selected_template',
        FOLLOW_UP_QUESTIONS: 'follow_up_questions',
        QUESTION_ANSWERS: 'question_answers',
        CURRENT_STEP: 'current_step',
        FORM_METADATA: 'form_metadata'
    };

    /**
     * Save company information to AsyncStorage
     * @param {Object} companyInfo - Company information object
     * @returns {Promise<boolean>} Success status
     */
    static async saveCompanyInfo(companyInfo) {
        try {
            // Check if documents contain actual File objects (new uploads) or document metadata (already stored)
            if (companyInfo.documents && companyInfo.documents.length > 0) {
                const hasFileObjects = companyInfo.documents.some(doc => doc instanceof File);
                
                if (hasFileObjects) {
                    // Handle new File uploads
                    const fileObjects = companyInfo.documents.filter(doc => doc instanceof File);
                    const existingDocuments = companyInfo.documents.filter(doc => !(doc instanceof File));
                    
                    const savedFilePaths = await FileManager.saveFiles(fileObjects);
                    
                    // Combine existing documents with newly saved files
                    const allDocuments = [
                        ...existingDocuments,
                        ...savedFilePaths.map((path, index) => ({
                            path,
                            name: fileObjects[index].name,
                            size: fileObjects[index].size,
                            type: fileObjects[index].type
                        }))
                    ];
                    
                    const companyInfoToStore = {
                        ...companyInfo,
                        documents: allDocuments
                    };
                    
                    await AsyncStorage.setItem(this.KEYS.COMPANY_INFO, companyInfoToStore);
                } else {
                    // All documents are already stored metadata, save as is
                    await AsyncStorage.setItem(this.KEYS.COMPANY_INFO, companyInfo);
                }
            } else {
                await AsyncStorage.setItem(this.KEYS.COMPANY_INFO, companyInfo);
            }

            console.log('Company information saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving company information:', error);
            return false;
        }
    }

    /**
     * Get company information from AsyncStorage
     * @returns {Promise<Object|null>} Company information object or null
     */
    static async getCompanyInfo() {
        try {
            const companyInfo = await AsyncStorage.getItem(this.KEYS.COMPANY_INFO);
            
            if (companyInfo) {
                const parsedInfo = typeof companyInfo === 'string' ? JSON.parse(companyInfo) : companyInfo;
                
                // If there are document references, we keep them as references
                // The actual file data is managed by FileManager
                return parsedInfo;
            }
            
            return null;
        } catch (error) {
            console.error('Error getting company information:', error);
            return null;
        }
    }

    /**
     * Update specific field in company information
     * @param {string} field - Field name to update
     * @param {any} value - New value for the field
     * @returns {Promise<boolean>} Success status
     */
    static async updateCompanyInfoField(field, value) {
        try {
            const currentInfo = await this.getCompanyInfo() || {};
            const updatedInfo = { ...currentInfo, [field]: value };
            return await this.saveCompanyInfo(updatedInfo);
        } catch (error) {
            console.error('Error updating company info field:', error);
            return false;
        }
    }

    /**
     * Save selected template
     * @param {Object} template - Selected grant template
     * @returns {Promise<boolean>} Success status
     */
    static async saveSelectedTemplate(template) {
        try {
            await AsyncStorage.setItem(this.KEYS.SELECTED_TEMPLATE, template);
            console.log('Selected template saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving selected template:', error);
            return false;
        }
    }

    /**
     * Get selected template
     * @returns {Promise<Object|null>} Selected template or null
     */
    static async getSelectedTemplate() {
        try {
            const template = await AsyncStorage.getItem(this.KEYS.SELECTED_TEMPLATE);
            return template ? (typeof template === 'string' ? JSON.parse(template) : template) : null;
        } catch (error) {
            console.error('Error getting selected template:', error);
            return null;
        }
    }

    /**
     * Save follow-up questions
     * @param {Array} questions - Array of follow-up questions
     * @returns {Promise<boolean>} Success status
     */
    static async saveFollowUpQuestions(questions) {
        try {
            await AsyncStorage.setItem(this.KEYS.FOLLOW_UP_QUESTIONS, questions);
            console.log('Follow-up questions saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving follow-up questions:', error);
            return false;
        }
    }

    /**
     * Get follow-up questions
     * @returns {Promise<Array>} Array of follow-up questions
     */
    static async getFollowUpQuestions() {
        try {
            const questions = await AsyncStorage.getItem(this.KEYS.FOLLOW_UP_QUESTIONS);
            return questions ? (typeof questions === 'string' ? JSON.parse(questions) : questions) : [];
        } catch (error) {
            console.error('Error getting follow-up questions:', error);
            return [];
        }
    }

    /**
     * Save question answers
     * @param {Object} answers - Question answers object
     * @returns {Promise<boolean>} Success status
     */
    static async saveQuestionAnswers(answers) {
        try {
            await AsyncStorage.setItem(this.KEYS.QUESTION_ANSWERS, answers);
            console.log('Question answers saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving question answers:', error);
            return false;
        }
    }

    /**
     * Get question answers
     * @returns {Promise<Object>} Question answers object
     */
    static async getQuestionAnswers() {
        try {
            const answers = await AsyncStorage.getItem(this.KEYS.QUESTION_ANSWERS);
            return answers ? (typeof answers === 'string' ? JSON.parse(answers) : answers) : {};
        } catch (error) {
            console.error('Error getting question answers:', error);
            return {};
        }
    }

    /**
     * Update specific question answer
     * @param {string|number} questionId - Question ID
     * @param {any} answer - Answer value
     * @returns {Promise<boolean>} Success status
     */
    static async updateQuestionAnswer(questionId, answer) {
        try {
            const currentAnswers = await this.getQuestionAnswers();
            const updatedAnswers = { ...currentAnswers, [questionId]: answer };
            return await this.saveQuestionAnswers(updatedAnswers);
        } catch (error) {
            console.error('Error updating question answer:', error);
            return false;
        }
    }

    /**
     * Save current step
     * @param {number} step - Current form step
     * @returns {Promise<boolean>} Success status
     */
    static async saveCurrentStep(step) {
        try {
            await AsyncStorage.setItem(this.KEYS.CURRENT_STEP, step.toString());
            return true;
        } catch (error) {
            console.error('Error saving current step:', error);
            return false;
        }
    }

    /**
     * Get current step
     * @returns {Promise<number>} Current form step (defaults to 1)
     */
    static async getCurrentStep() {
        try {
            const step = await AsyncStorage.getItem(this.KEYS.CURRENT_STEP);
            return step ? parseInt(step, 10) : 1;
        } catch (error) {
            console.error('Error getting current step:', error);
            return 1;
        }
    }

    /**
     * Save form metadata (timestamps, etc.)
     * @param {Object} metadata - Form metadata
     * @returns {Promise<boolean>} Success status
     */
    static async saveFormMetadata(metadata) {
        try {
            const currentMetadata = await this.getFormMetadata();
            const updatedMetadata = {
                ...currentMetadata,
                ...metadata,
                lastUpdated: new Date().toISOString()
            };
            await AsyncStorage.setItem(this.KEYS.FORM_METADATA, updatedMetadata);
            return true;
        } catch (error) {
            console.error('Error saving form metadata:', error);
            return false;
        }
    }

    /**
     * Get form metadata
     * @returns {Promise<Object>} Form metadata object
     */
    static async getFormMetadata() {
        try {
            const metadata = await AsyncStorage.getItem(this.KEYS.FORM_METADATA);
            return metadata ? (typeof metadata === 'string' ? JSON.parse(metadata) : metadata) : {};
        } catch (error) {
            console.error('Error getting form metadata:', error);
            return {};
        }
    }

    /**
     * Get all form data (for sending to backend)
     * @returns {Promise<Object>} Complete form data object
     */
    static async getAllFormData() {
        try {
            const [
                companyInfo,
                selectedTemplate,
                followUpQuestions,
                questionAnswers,
                currentStep,
                formMetadata
            ] = await Promise.all([
                this.getCompanyInfo(),
                this.getSelectedTemplate(),
                this.getFollowUpQuestions(),
                this.getQuestionAnswers(),
                this.getCurrentStep(),
                this.getFormMetadata()
            ]);

            return {
                companyInfo,
                selectedTemplate,
                followUpQuestions,
                questionAnswers,
                currentStep,
                formMetadata
            };
        } catch (error) {
            console.error('Error getting all form data:', error);
            return {};
        }
    }

    /**
     * Clear all stored form data
     * @returns {Promise<boolean>} Success status
     */
    static async clearAllData() {
        try {
            const keys = Object.values(this.KEYS);
            await AsyncStorage.multiRemove(keys);
            
            // Also clear uploaded files
            await FileManager.clearAllFiles();
            
            console.log('All form data cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    }

    /**
     * Check if form has any saved data
     * @returns {Promise<boolean>} True if any data exists
     */
    static async hasAnyData() {
        try {
            const formData = await this.getAllFormData();
            return !!(
                formData.companyInfo ||
                formData.selectedTemplate ||
                formData.followUpQuestions?.length ||
                Object.keys(formData.questionAnswers || {}).length ||
                formData.currentStep > 1
            );
        } catch (error) {
            console.error('Error checking for data:', error);
            return false;
        }
    }

    /**
     * Add a document to company info
     * @param {File} file - File to add
     * @returns {Promise<boolean>} Success status
     */
    static async addDocument(file) {
        try {
            if (!file || !(file instanceof File)) {
                throw new Error(`Invalid file object. Expected File, got: ${file?.constructor?.name || typeof file}`);
            }

            const companyInfo = await this.getCompanyInfo() || {};
            const documents = companyInfo.documents || [];
            
            // Add the File object directly to the documents array
            // saveCompanyInfo will handle the file storage
            documents.push(file);

            return await this.updateCompanyInfoField('documents', documents);
        } catch (error) {
            console.error('Error adding document:', error);
            return false;
        }
    }

    /**
     * Remove a document from company info
     * @param {number} index - Document index to remove
     * @returns {Promise<boolean>} Success status
     */
    static async removeDocument(index) {
        try {
            const companyInfo = await this.getCompanyInfo() || {};
            const documents = companyInfo.documents || [];
            
            if (index >= 0 && index < documents.length) {
                const documentToRemove = documents[index];
                
                // Delete the actual file
                if (documentToRemove.path) {
                    await FileManager.deleteFile(documentToRemove.path);
                }
                
                // Remove from documents array
                const updatedDocuments = documents.filter((_, i) => i !== index);
                return await this.updateCompanyInfoField('documents', updatedDocuments);
            }
            
            return false;
        } catch (error) {
            console.error('Error removing document:', error);
            return false;
        }
    }

    /**
     * Get storage statistics
     * @returns {Promise<Object>} Storage statistics
     */
    static async getStorageStats() {
        try {
            const fileStats = await FileManager.getStorageStats();
            const formData = await this.getAllFormData();
            
            return {
                ...fileStats,
                hasFormData: await this.hasAnyData(),
                formDataKeys: Object.keys(formData).filter(key => formData[key] != null),
                lastUpdated: formData.formMetadata?.lastUpdated
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return {};
        }
    }
}

export default CompanyStorageService;
