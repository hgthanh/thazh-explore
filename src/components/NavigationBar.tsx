import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface NavigationBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onTabs: () => void;
  onBookmarks: () => void;
  tabCount: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onTabs,
  onBookmarks,
  tabCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            !canGoBack && styles.navButtonDisabled,
          ]}
          onPress={onGoBack}
          disabled={!canGoBack}
          activeOpacity={0.6}>
          <Icon
            name="chevron-back"
            size={24}
            color={canGoBack ? '#007AFF' : '#C7C7CC'}
          />
        </TouchableOpacity>

        {/* Forward Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            !canGoForward && styles.navButtonDisabled,
          ]}
          onPress={onGoForward}
          disabled={!canGoForward}
          activeOpacity={0.6}>
          <Icon
            name="chevron-forward"
            size={24}
            color={canGoForward ? '#007AFF' : '#C7C7CC'}
          />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.6}>
          <Icon
            name="share-outline"
            size={22}
            color="#007AFF"
          />
        </TouchableOpacity>

        {/* Bookmarks Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={onBookmarks}
          activeOpacity={0.6}>
          <Icon
            name="book-outline"
            size={22}
            color="#007AFF"
          />
        </TouchableOpacity>

        {/* Tabs Button */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={onTabs}
          activeOpacity={0.6}>
          <View style={styles.tabIcon}>
            <View style={styles.tabIconBorder}>
              <Text style={styles.tabCount}>
                {tabCount > 99 ? '99+' : tabCount.toString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 0.5,
    borderTopColor: '#C7C7CC',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBorder: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 4,
    minWidth: 24,
    minHeight: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default NavigationBar;