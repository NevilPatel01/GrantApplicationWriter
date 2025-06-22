import AsyncStorage from './AsyncStorage';

/**
 * File Manager utility for handling file uploads and local storage
 * Saves files to a virtual "pages" folder using browser storage
 */
class FileManager {
    static STORAGE_PREFIX = 'grant_app_files_';
    static PAGES_FOLDER = 'pages';

    /**
     * Save a file to the virtual pages folder
     * @param {File} file - The file object to save
     * @returns {Promise<string>} The file path/identifier
     */
    static async saveFile(file) {
        try {
            // Validate file input
            if (!file || !(file instanceof File)) {
                throw new Error('Invalid file: Expected File object');
            }

            // Generate unique file identifier
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const filePath = `${this.PAGES_FOLDER}/${fileName}`;
            
            // Convert file to base64 for storage
            const base64Data = await this.fileToBase64(file);
            
            // Create file metadata
            const fileMetadata = {
                name: file.name,
                originalName: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                data: base64Data,
                savedAt: timestamp,
                path: filePath
            };

            // Save to AsyncStorage
            const storageKey = `${this.STORAGE_PREFIX}${fileName}`;
            await AsyncStorage.setItem(storageKey, fileMetadata);

            // Update file index
            await this.updateFileIndex(fileName, fileMetadata);

            console.log(`File saved successfully: ${filePath}`);
            return filePath;
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    /**
     * Save multiple files to the virtual pages folder
     * @param {FileList|File[]} files - Array of files to save
     * @returns {Promise<string[]>} Array of file paths/identifiers
     */
    static async saveFiles(files) {
        try {
            if (!files || files.length === 0) {
                throw new Error('No files provided');
            }

            const filesArray = Array.from(files);
            
            // Validate all files before processing
            filesArray.forEach((file, index) => {
                if (!file || !(file instanceof File)) {
                    throw new Error(`Invalid file at index ${index}: Expected File object`);
                }
            });

            const saveTasks = filesArray.map(file => this.saveFile(file));
            return await Promise.all(saveTasks);
        } catch (error) {
            console.error('Error saving files:', error);
            throw error;
        }
    }

    /**
     * Get a saved file by path
     * @param {string} filePath - The file path/identifier
     * @returns {Promise<Object|null>} File metadata object or null if not found
     */
    static async getFile(filePath) {
        try {
            const fileName = filePath.replace(`${this.PAGES_FOLDER}/`, '');
            const storageKey = `${this.STORAGE_PREFIX}${fileName}`;
            const fileData = await AsyncStorage.getItem(storageKey);
            
            if (fileData) {
                return typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
            }
            return null;
        } catch (error) {
            console.error('Error getting file:', error);
            return null;
        }
    }

    /**
     * Get all saved files
     * @returns {Promise<Object[]>} Array of file metadata objects
     */
    static async getAllFiles() {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const fileKeys = allKeys.filter(key => key.startsWith(this.STORAGE_PREFIX));
            
            const files = await Promise.all(
                fileKeys.map(async (key) => {
                    const fileData = await AsyncStorage.getItem(key);
                    return typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
                })
            );

            return files.filter(file => file !== null);
        } catch (error) {
            console.error('Error getting all files:', error);
            return [];
        }
    }

    /**
     * Delete a file by path
     * @param {string} filePath - The file path/identifier
     * @returns {Promise<boolean>} True if deleted successfully
     */
    static async deleteFile(filePath) {
        try {
            const fileName = filePath.replace(`${this.PAGES_FOLDER}/`, '');
            const storageKey = `${this.STORAGE_PREFIX}${fileName}`;
            
            await AsyncStorage.removeItem(storageKey);
            await this.removeFromFileIndex(fileName);
            
            console.log(`File deleted successfully: ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    /**
     * Clear all saved files
     * @returns {Promise<boolean>} True if cleared successfully
     */
    static async clearAllFiles() {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const fileKeys = allKeys.filter(key => key.startsWith(this.STORAGE_PREFIX));
            
            await AsyncStorage.multiRemove(fileKeys);
            await AsyncStorage.removeItem('file_index');
            
            console.log('All files cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing files:', error);
            return false;
        }
    }

    /**
     * Get file as blob for download or display
     * @param {string} filePath - The file path/identifier
     * @returns {Promise<Blob|null>} Blob object or null if not found
     */
    static async getFileAsBlob(filePath) {
        try {
            const fileMetadata = await this.getFile(filePath);
            if (!fileMetadata) return null;

            // Convert base64 back to blob
            const base64Data = fileMetadata.data.split(',')[1]; // Remove data:type;base64, prefix
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: fileMetadata.type });
        } catch (error) {
            console.error('Error converting file to blob:', error);
            return null;
        }
    }

    /**
     * Download a saved file
     * @param {string} filePath - The file path/identifier
     * @returns {Promise<boolean>} True if download initiated successfully
     */
    static async downloadFile(filePath) {
        try {
            const fileMetadata = await this.getFile(filePath);
            if (!fileMetadata) {
                console.error('File not found:', filePath);
                return false;
            }

            const blob = await this.getFileAsBlob(filePath);
            if (!blob) return false;

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileMetadata.originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`File download initiated: ${fileMetadata.originalName}`);
            return true;
        } catch (error) {
            console.error('Error downloading file:', error);
            return false;
        }
    }

    /**
     * Convert file to base64 string
     * @param {File} file - The file to convert
     * @returns {Promise<string>} Base64 string representation
     */
    /**
     * Convert file to base64 data URL
     * @param {File|Blob} file - File or Blob object to convert
     * @returns {Promise<string>} Base64 data URL
     */
    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            // Validate that the input is a File or Blob
            if (!file || !(file instanceof File || file instanceof Blob)) {
                reject(new Error('Invalid file: Expected File or Blob object'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Update the file index for easier management
     * @param {string} fileName - The file name
     * @param {Object} metadata - File metadata
     * @returns {Promise<void>}
     */
    static async updateFileIndex(fileName, metadata) {
        try {
            const indexData = await AsyncStorage.getItem('file_index');
            const index = indexData ? JSON.parse(indexData) : {};
            
            index[fileName] = {
                name: metadata.name,
                path: metadata.path,
                size: metadata.size,
                type: metadata.type,
                savedAt: metadata.savedAt
            };

            await AsyncStorage.setItem('file_index', index);
        } catch (error) {
            console.error('Error updating file index:', error);
        }
    }

    /**
     * Remove file from index
     * @param {string} fileName - The file name to remove
     * @returns {Promise<void>}
     */
    static async removeFromFileIndex(fileName) {
        try {
            const indexData = await AsyncStorage.getItem('file_index');
            if (indexData) {
                const index = JSON.parse(indexData);
                delete index[fileName];
                await AsyncStorage.setItem('file_index', index);
            }
        } catch (error) {
            console.error('Error removing from file index:', error);
        }
    }

    /**
     * Get storage statistics
     * @returns {Promise<Object>} Storage statistics
     */
    static async getStorageStats() {
        try {
            const files = await this.getAllFiles();
            const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
            
            return {
                totalFiles: files.length,
                totalSize,
                totalSizeFormatted: this.formatFileSize(totalSize),
                files: files.map(f => ({
                    name: f.name,
                    size: f.size,
                    sizeFormatted: this.formatFileSize(f.size),
                    path: f.path
                }))
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return { totalFiles: 0, totalSize: 0, totalSizeFormatted: '0 B', files: [] };
        }
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size string
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default FileManager;
