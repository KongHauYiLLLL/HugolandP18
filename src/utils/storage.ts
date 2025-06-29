// Browser-based AsyncStorage implementation with error handling
class AsyncStorage {
  static async getItem(key: string): Promise<string | null> {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return;
      }
      
      // Check if we have enough storage space
      const testKey = `__storage_test_${Date.now()}`;
      try {
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (storageError) {
        console.warn('Storage quota exceeded, clearing old data');
        // Try to clear some space by removing old saves
        this.clearOldData();
      }
      
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
      // Don't throw error to avoid breaking the game
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return;
      }
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return;
      }
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  private static clearOldData(): void {
    try {
      // Remove any old backup saves or temporary data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('backup') || key.includes('temp') || key.includes('old'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing old data:', error);
        }
      });
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }
}

export default AsyncStorage;