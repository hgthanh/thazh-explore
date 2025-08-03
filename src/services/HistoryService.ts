import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitTime: number;
  visitCount: number;
}

const HISTORY_KEY = 'thazh_history';
const MAX_HISTORY_ITEMS = 1000;

export class HistoryService {
  static async getHistory(): Promise<HistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        // Sort by visit time (newest first)
        return history.sort((a: HistoryItem, b: HistoryItem) => b.visitTime - a.visitTime);
      }
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  static async addHistory(url: string, title: string): Promise<void> {
    try {
      // Skip adding to history for search engine
      if (url.includes('thazhsearch.wuaze.com')) {
        return;
      }

      const history = await this.getHistory();
      
      // Check if URL already exists in history
      const existingItemIndex = history.findIndex(item => item.url === url);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = history[existingItemIndex];
        existingItem.visitTime = Date.now();
        existingItem.visitCount += 1;
        existingItem.title = title || existingItem.title;
        
        // Move to top
        history.splice(existingItemIndex, 1);
        history.unshift(existingItem);
      } else {
        // Add new item
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          url,
          title: title || url,
          visitTime: Date.now(),
          visitCount: 1,
        };
        
        history.unshift(newHistoryItem);
      }

      // Limit history size
      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding history:', error);
    }
  }

  static async deleteHistoryItem(historyId: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filteredHistory = history.filter(item => item.id !== historyId);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  static async searchHistory(query: string): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const lowercaseQuery = query.toLowerCase().trim();
      
      if (!lowercaseQuery) {
        return history;
      }

      return history.filter(item =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.url.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching history:', error);
      return [];
    }
  }

  static async getFrequentSites(limit: number = 10): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      
      // Sort by visit count and visit time
      const frequentSites = history
        .filter(item => item.visitCount > 1)
        .sort((a, b) => {
          if (a.visitCount === b.visitCount) {
            return b.visitTime - a.visitTime;
          }
          return b.visitCount - a.visitCount;
        })
        .slice(0, limit);

      return frequentSites;
    } catch (error) {
      console.error('Error getting frequent sites:', error);
      return [];
    }
  }

  static async getHistoryByDate(date: Date): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return history.filter(item => 
        item.visitTime >= startOfDay.getTime() && 
        item.visitTime <= endOfDay.getTime()
      );
    } catch (error) {
      console.error('Error getting history by date:', error);
      return [];
    }
  }
}