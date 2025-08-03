import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {BookmarkService, Bookmark} from '../services/BookmarkService';

interface BookmarksScreenProps {
  navigation: any;
}

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({navigation}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await BookmarkService.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookmarkPress = (bookmark: Bookmark) => {
    if (isEditing) {
      toggleBookmarkSelection(bookmark.id);
    } else {
      // Navigate back to browser with the selected URL
      navigation.navigate('Browser', {url: bookmark.url});
    }
  };

  const toggleBookmarkSelection = (bookmarkId: string) => {
    const newSelection = new Set(selectedBookmarks);
    if (newSelection.has(bookmarkId)) {
      newSelection.delete(bookmarkId);
    } else {
      newSelection.add(bookmarkId);
    }
    setSelectedBookmarks(newSelection);
  };

  const deleteSelectedBookmarks = async () => {
    if (selectedBookmarks.size === 0) return;

    Alert.alert(
      'Delete Bookmarks',
      `Are you sure you want to delete ${selectedBookmarks.size} bookmark(s)?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const bookmarkId of selectedBookmarks) {
                await BookmarkService.deleteBookmark(bookmarkId);
              }
              setSelectedBookmarks(new Set());
              setIsEditing(false);
              loadBookmarks();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bookmarks');
            }
          },
        },
      ]
    );
  };

  const deleteBookmark = async (bookmarkId: string) => {
    Alert.alert(
      'Delete Bookmark',
      'Are you sure you want to delete this bookmark?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookmarkService.deleteBookmark(bookmarkId);
              loadBookmarks();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bookmark');
            }
          },
        },
      ]
    );
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  const renderBookmark = ({item}: {item: Bookmark}) => {
    const isSelected = selectedBookmarks.has(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.bookmarkItem,
          isSelected && styles.bookmarkItemSelected,
        ]}
        onPress={() => handleBookmarkPress(item)}
        onLongPress={() => {
          if (!isEditing) {
            setIsEditing(true);
            toggleBookmarkSelection(item.id);
          }
        }}>
        
        <View style={styles.bookmarkContent}>
          {isEditing && (
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                isSelected && styles.checkboxSelected,
              ]}>
                {isSelected && (
                  <Icon name="checkmark" size={16} color="white" />
                )}
              </View>
            </View>
          )}
          
          <View style={styles.faviconContainer}>
            <Icon 
              name="bookmark" 
              size={20} 
              color="#007AFF" 
            />
          </View>
          
          <View style={styles.bookmarkInfo}>
            <Text style={styles.bookmarkTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.bookmarkUrl} numberOfLines={1}>
              {item.url}
            </Text>
          </View>
          
          {!isEditing && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => deleteBookmark(item.id)}>
              <Icon name="ellipsis-horizontal" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Done</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Bookmarks</Text>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
              setSelectedBookmarks(new Set());
            } else {
              setIsEditing(true);
            }
          }}>
          <Text style={styles.editText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookmarks"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bookmarks List */}
      <FlatList
        data={filteredBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookmark}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="bookmark-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'No bookmarks match your search'
                : 'Bookmarks you save will appear here'
              }
            </Text>
          </View>
        )}
      />

      {/* Bottom Actions (when editing) */}
      {isEditing && selectedBookmarks.size > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteSelectedBookmarks}>
            <Icon name="trash-outline" size={20} color="white" />
            <Text style={styles.deleteButtonText}>
              Delete ({selectedBookmarks.size})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  editButton: {
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  bookmarkItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookmarkItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  faviconContainer: {
    marginRight: 12,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  bookmarkUrl: {
    fontSize: 14,
    color: '#8E8E93',
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomActions: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 0.5,
    borderTopColor: '#C7C7CC',
    padding: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BookmarksScreen;