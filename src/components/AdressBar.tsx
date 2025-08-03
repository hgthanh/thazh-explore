import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AddressBarProps {
  url: string;
  title: string;
  loading: boolean;
  progress: number;
  onNavigate: (url: string) => void;
  onReload: () => void;
  onShare: () => void;
  onBookmark: () => void;
  isDesktopMode: boolean;
  onToggleDesktopMode: () => void;
}

const AddressBar: React.FC<AddressBarProps> = ({
  url,
  title,
  loading,
  progress,
  onNavigate,
  onReload,
  onShare,
  onBookmark,
  isDesktopMode,
  onToggleDesktopMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const {width: screenWidth} = Dimensions.get('window');

  React.useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(url);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
      inputRef.current?.blur();
    }
  };

  const getDisplayUrl = () => {
    if (isEditing) return inputValue;
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const getSecurityIcon = () => {
    if (url.startsWith('https://')) {
      return 'lock-closed';
    } else if (url.startsWith('http://')) {
      return 'lock-open';
    }
    return 'search';
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      )}

      <View style={styles.addressBarContainer}>
        {/* Security/Search Icon */}
        <View style={styles.leftIcon}>
          <Icon
            name={getSecurityIcon()}
            size={16}
            color={url.startsWith('https://') ? '#34C759' : '#8E8E93'}
          />
        </View>

        {/* Address Input */}
        <TouchableOpacity
          style={styles.urlContainer}
          onPress={() => {
            setIsEditing(true);
            inputRef.current?.focus();
          }}
          activeOpacity={0.7}>
          <TextInput
            ref={inputRef}
            style={styles.urlInput}
            value={isEditing ? inputValue : ''}
            placeholder={isEditing ? 'Search or enter website' : getDisplayUrl()}
            placeholderTextColor="#8E8E93"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            selectTextOnFocus={true}
          />
          
          {!isEditing && (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          )}
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {loading ? (
            <TouchableOpacity onPress={onReload} style={styles.actionButton}>
              <Icon name="close" size={18} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onReload} style={styles.actionButton}>
              <Icon name="refresh" size={18} color="#007AFF" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.actionButton}>
            <Icon name="ellipsis-horizontal" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onBookmark();
              setShowMenu(false);
            }}>
            <Icon name="bookmark-outline" size={20} color="#007AFF" />
            <Text style={styles.menuText}>Add Bookmark</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onShare();
              setShowMenu(false);
            }}>
            <Icon name="share-outline" size={20} color="#007AFF" />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onToggleDesktopMode();
              setShowMenu(false);
            }}>
            <Icon 
              name="desktop-outline" 
              size={20} 
              color={isDesktopMode ? "#34C759" : "#007AFF"} 
            />
            <Text style={[
              styles.menuText,
              isDesktopMode && styles.menuTextActive
            ]}>
              Desktop Mode {isDesktopMode ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <TouchableOpacity 
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  addressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  urlContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  urlInput: {
    fontSize: 16,
    color: '#000',
    padding: 0,
    margin: 0,
    height: 20,
  },
  titleText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
  },
  menuTextActive: {
    color: '#34C759',
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
});

export default AddressBar;