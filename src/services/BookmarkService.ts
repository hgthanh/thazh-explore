import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  dateAdded: number;
  favicon?: string;
}

const BOOKMARKS_KEY = 'thazh_bookmarks';

export class BookmarkService {
  static async getBookmarks(): Promise<Bookmark[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (bookmarksJson) {
        const bookmarks = JSON.parse(bookmarksJson);
        // Sort by date added (newest first)
        return bookmarks.sort((a: Bookmark, b: Bookmark) => b.dateAdded - a.dateAdded);
      }
      return [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  static async addBookmark(url: string, title: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      
      // Check if bookmark already exists
      const existingBookmark = bookmarks.find(bookmark => bookmark.url === url);
      if (existingBookmark) {
        throw new Error('Bookmark already exists');
      }

      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        url,
        title: title || url,
        dateAdded: Date.now(),
      };

      bookmarks.unshift(newBookmark);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  static async deleteBookmark(bookmarkId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }

  static async updateBookmark(bookmarkId: string, updates: Partial<Bookmark>): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);
      
      if (bookmarkIndex === -1) {
        throw new Error('Bookmark not found');
      }

      bookmarks[bookmarkIndex] = {
        ...bookmarks[bookmarkIndex],
        ...updates,
      };

      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  }

  static async isBookmarked(url: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(bookmark => bookmark.url === url);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }

  static async searchBookmarks(query: string): Promise<Bookmark[]> {
    try {
      const bookmarks = await this.getBookmarks();
      const lowercaseQuery = query.toLowerCase().trim();
      
      if (!lowercaseQuery) {
        return bookmarks;
      }

      return bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(lowercaseQuery) ||
        bookmark.url.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      return [];
    }
  }

  static async clearAllBookmarks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }

  static async exportBookmarks(): Promise<string> {
    try {
      const bookmarks = await this.getBookmarks();
      return JSON.stringify(bookmarks, null, 2);
    } catch (error) {
      console.error('Error exporting bookmarks:', error);
      throw error;
    }
  }

  static async importBookmarks(bookmarksJson: string): Promise<void> {
    try {
      const importedBookmarks = JSON.parse(bookmarksJson);
      
      if (!Array.isArray(importedBookmarks)) {
        throw new Error('Invalid bookmarks format');
      }

      // Validate each bookmark
      const validBookmarks = importedBookmarks.filter(bookmark => 
        bookmark &&
        typeof bookmark.url === 'string' &&
        typeof bookmark.title === 'string' &&
        bookmark.url.trim() !== ''
      );

      if (validBookmarks.length === 0) {
        throw new Error('No valid bookmarks found');
      }

      // Assign new IDs and timestamps to avoid conflicts
      const processedBookmarks: Bookmark[] = validBookmarks.map((bookmark, index) => ({
        ...bookmark,
        id: (Date.now() + index).toString(),
        dateAdded: bookmark.dateAdded || Date.now(),
      }));

      const existingBookmarks = await this.getBookmarks();
      const mergedBookmarks = [...processedBookmarks, ...existingBookmarks];
      
      // Remove duplicates based on URL
      const uniqueBookmarks = mergedBookmarks.filter((bookmark, index, array) =>
        array.findIndex(b => b.url === bookmark.url) === index
      );

      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(uniqueBookmarks));
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      throw error;
    }
  }
}