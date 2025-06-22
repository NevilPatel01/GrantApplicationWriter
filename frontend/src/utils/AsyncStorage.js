import localforage from 'localforage';

// Configure localforage to use IndexedDB for better performance and storage capacity
localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'GrantApplicationStorage',
    version: 1.0,
    storeName: 'grantAppData',
    description: 'Storage for Grant Application form data'
});

/**
 * AsyncStorage utility that provides an AsyncStorage-like API for web browsers
 * using localforage under the hood for better performance and storage capacity
 */
class AsyncStorage {
    /**
     * Store a value with the given key
     * @param {string} key - The key to store the value under
     * @param {any} value - The value to store (will be JSON stringified)
     * @returns {Promise<void>}
     */
    static async setItem(key, value) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await localforage.setItem(key, stringValue);
        } catch (error) {
            console.error('AsyncStorage setItem error:', error);
            throw error;
        }
    }

    /**
     * Get a value by key
     * @param {string} key - The key to retrieve the value for
     * @returns {Promise<string|null>} The stored value or null if not found
     */
    static async getItem(key) {
        try {
            const value = await localforage.getItem(key);
            return value;
        } catch (error) {
            console.error('AsyncStorage getItem error:', error);
            throw error;
        }
    }

    /**
     * Remove a value by key
     * @param {string} key - The key to remove
     * @returns {Promise<void>}
     */
    static async removeItem(key) {
        try {
            await localforage.removeItem(key);
        } catch (error) {
            console.error('AsyncStorage removeItem error:', error);
            throw error;
        }
    }

    /**
     * Clear all stored values
     * @returns {Promise<void>}
     */
    static async clear() {
        try {
            await localforage.clear();
        } catch (error) {
            console.error('AsyncStorage clear error:', error);
            throw error;
        }
    }

    /**
     * Get all keys
     * @returns {Promise<string[]>} Array of all keys
     */
    static async getAllKeys() {
        try {
            return await localforage.keys();
        } catch (error) {
            console.error('AsyncStorage getAllKeys error:', error);
            throw error;
        }
    }

    /**
     * Get multiple items by keys
     * @param {string[]} keys - Array of keys to retrieve
     * @returns {Promise<Array<[string, string|null]>>} Array of [key, value] pairs
     */
    static async multiGet(keys) {
        try {
            const results = await Promise.all(
                keys.map(async (key) => {
                    const value = await localforage.getItem(key);
                    return [key, value];
                })
            );
            return results;
        } catch (error) {
            console.error('AsyncStorage multiGet error:', error);
            throw error;
        }
    }

    /**
     * Set multiple items
     * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
     * @returns {Promise<void>}
     */
    static async multiSet(keyValuePairs) {
        try {
            await Promise.all(
                keyValuePairs.map(([key, value]) => {
                    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                    return localforage.setItem(key, stringValue);
                })
            );
        } catch (error) {
            console.error('AsyncStorage multiSet error:', error);
            throw error;
        }
    }

    /**
     * Remove multiple items by keys
     * @param {string[]} keys - Array of keys to remove
     * @returns {Promise<void>}
     */
    static async multiRemove(keys) {
        try {
            await Promise.all(keys.map(key => localforage.removeItem(key)));
        } catch (error) {
            console.error('AsyncStorage multiRemove error:', error);
            throw error;
        }
    }
}

export default AsyncStorage;
