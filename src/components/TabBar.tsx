import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Tab {
  id: string;
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddTab: () => void;
  onClose: () => void;
}

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH - 32;
const TAB_HEIGHT = 120;

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onAddTab,
  onClose,
}) => {
  const getTabPreview = (tab: Tab) => {
    try {
      const url = new URL(tab.url);
      return url.hostname;
    } catch {
      return tab.url.length > 30 ? tab.url.substring(0, 30) + '...' : tab.url;
    }
  };

  const getTabTitle = (tab: Tab) => {
    if (tab.title && tab.title !== 'New Tab') {
      return tab.title.length > 25 ? tab.title.substring(0, 25) + '...' : tab.title;
    }
    return getTabPreview(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tabs ({tabs.length})</Text>
        <TouchableOpacity onPress={onClose} style={styles.doneButton}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.tabsContainer}
        showsVerticalScrollIndicator={false}>
        
        {/* Add New Tab Button */}
        <TouchableOpacity
          style={styles.addTabButton}
          onPress={onAddTab}
          activeOpacity={0.8}>
          <View style={styles.addTabContent}>
            <Icon name="add" size={40} color="#007AFF" />
            <Text style={styles.addTabText}>New Tab</Text>
          </View>
        </TouchableOpacity>

        {/* Existing Tabs */}
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabCard,
              tab.id === activeTabId && styles.activeTabCard,
            ]}
            onPress={() => onSwitchTab(tab.id)}
            activeOpacity={0.8}>
            
            {/* Tab Content Preview */}
            <View style={styles.tabPreview}>
              <View style={styles.tabHeader}>
                <View style={styles.tabInfo}>
                  <Icon
                    name={tab.url.startsWith('https://') ? 'lock-closed' : 'globe-outline'}
                    size={12}
                    color="#8E8E93"
                  />
                  <Text style={styles.tabUrl} numberOfLines={1}>
                    {getTabPreview(tab)}
                  </Text>
                </View>
                
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon name="close" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Tab Content Area */}
              <View style={styles.tabContent}>
                <View style={styles.tabContentPlaceholder}>
                  <Text style={styles.tabTitle} numberOfLines={2}>
                    {getTabTitle(tab)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Active Tab Indicator */}
            {tab.id === activeTabId && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={onAddTab}>
          <Icon name="add" size={24} color="#007AFF" />
          <Text style={styles.bottomButtonText}>New Tab</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomDivider} />
        
        <TouchableOpacity style={styles.bottomButton}>
          <Icon name="copy-outline" size={22} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Private</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f2f2f7',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  addTabButton: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addTabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTabText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
  },
  tabCard: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  activeTabCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  tabPreview: {
    flex: 1,
    padding: 12,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tabInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tabUrl: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tabContentPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabTitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#007AFF',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 0.5,
    borderTopColor: '#C7C7CC',
    flexDirection: 'row',
    paddingVertical: 12,
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bottomButtonText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  bottomDivider: {
    width: 1,
    backgroundColor: '#C7C7CC',
    marginVertical: 8,
  },
});

export default TabBar;