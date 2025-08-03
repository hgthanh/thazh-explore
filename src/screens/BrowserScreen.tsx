import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavigationBar from '../components/NavigationBar';
import TabBar from '../components/TabBar';
import AddressBar from '../components/AddressBar';
import {BookmarkService} from '../services/BookmarkService';
import {HistoryService} from '../services/HistoryService';
import Orientation from 'react-native-orientation-locker';

interface Tab {
  id: string;
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
}

const DEFAULT_SEARCH_ENGINE = 'http://thazhsearch.wuaze.com';
const DEFAULT_URL = 'http://thazhsearch.wuaze.com';

const BrowserScreen: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      url: DEFAULT_URL,
      title: 'Thazh Search',
      canGoBack: false,
      canGoForward: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [isTabViewVisible, setIsTabViewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const webViewRefs = useRef<{[key: string]: WebView | null}>({});
  const {width: screenWidth} = Dimensions.get('window');

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    // Lock orientation to portrait by default
    Orientation.lockToPortrait();
    
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const formatUrl = (input: string): string => {
    if (!input.trim()) return DEFAULT_URL;
    
    // Check if it's a search query or URL
    if (input.includes(' ') || (!input.includes('.') && !input.includes(':'))) {
      return `${DEFAULT_SEARCH_ENGINE}?q=${encodeURIComponent(input)}`;
    }
    
    // Check if it already has protocol
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    
    // Add https by default
    return `https://${input}`;
  };

  const navigateToUrl = (url: string) => {
    const formattedUrl = formatUrl(url);
    updateTabUrl(activeTabId, formattedUrl);
  };

  const updateTabUrl = (tabId: string, url: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? {...tab, url} : tab
      )
    );
  };

  const updateTabTitle = (tabId: string, title: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? {...tab, title} : tab
      )
    );
  };

  const updateTabNavigation = (tabId: string, canGoBack: boolean, canGoForward: boolean) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? {...tab, canGoBack, canGoForward} : tab
      )
    );
  };

  const addNewTab = () => {
    const newTabId = Date.now().toString();
    const newTab: Tab = {
      id: newTabId,
      url: DEFAULT_URL,
      title: 'New Tab',
      canGoBack: false,
      canGoForward: false,
    };
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTabId);
    setIsTabViewVisible(false);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      // If it's the last tab, create a new one
      addNewTab();
      return;
    }

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (activeTabId === tabId) {
      // Switch to next tab or previous if it was the last one
      const newActiveIndex = tabIndex < newTabs.length ? tabIndex : tabIndex - 1;
      setActiveTabId(newTabs[newActiveIndex].id);
    }
    
    setTabs(newTabs);
    delete webViewRefs.current[tabId];
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    setIsTabViewVisible(false);
  };

  const goBack = () => {
    const webView = webViewRefs.current[activeTabId];
    if (webView && activeTab?.canGoBack) {
      webView.goBack();
    }
  };

  const goForward = () => {
    const webView = webViewRefs.current[activeTabId];
    if (webView && activeTab?.canGoForward) {
      webView.goForward();
    }
  };

  const reload = () => {
    const webView = webViewRefs.current[activeTabId];
    if (webView) {
      webView.reload();
    }
  };

  const toggleDesktopMode = () => {
    setIsDesktopMode(!isDesktopMode);
    // Reload current page with new user agent
    setTimeout(() => {
      reload();
    }, 100);
  };

  const addBookmark = async () => {
    if (activeTab) {
      try {
        await BookmarkService.addBookmark(activeTab.url, activeTab.title);
        Alert.alert('Success', 'Bookmark added successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to add bookmark');
      }
    }
  };

  const shareUrl = () => {
    if (activeTab) {
      // Import Share from react-native-share if needed
      Alert.alert('Share', `Share: ${activeTab.url}`);
    }
  };

  const getUserAgent = () => {
    if (isDesktopMode) {
      return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }
    return undefined; // Use default mobile user agent
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f8f9fa" 
        translucent={false}
      />
      
      <AddressBar
        url={activeTab?.url || ''}
        title={activeTab?.title || ''}
        loading={loading}
        progress={progress}
        onNavigate={navigateToUrl}
        onReload={reload}
        onShare={shareUrl}
        onBookmark={addBookmark}
        isDesktopMode={isDesktopMode}
        onToggleDesktopMode={toggleDesktopMode}
      />

      {isTabViewVisible && (
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={switchTab}
          onCloseTab={closeTab}
          onAddTab={addNewTab}
          onClose={() => setIsTabViewVisible(false)}
        />
      )}

      <View style={styles.webViewContainer}>
        {tabs.map(tab => (
          <WebView
            key={tab.id}
            ref={(ref) => {
              webViewRefs.current[tab.id] = ref;
            }}
            source={{uri: tab.url}}
            style={[
              styles.webView,
              {display: tab.id === activeTabId ? 'flex' : 'none'}
            ]}
            userAgent={getUserAgent()}
            onLoadStart={() => {
              if (tab.id === activeTabId) {
                setLoading(true);
                setProgress(0);
              }
            }}
            onLoadProgress={({nativeEvent}) => {
              if (tab.id === activeTabId) {
                setProgress(nativeEvent.progress);
              }
            }}
            onLoadEnd={() => {
              if (tab.id === activeTabId) {
                setLoading(false);
                setProgress(1);
              }
            }}
            onNavigationStateChange={(navState) => {
              if (tab.id === activeTabId) {
                updateTabUrl(tab.id, navState.url);
                updateTabTitle(tab.id, navState.title);
                updateTabNavigation(tab.id, navState.canGoBack, navState.canGoForward);
                
                // Add to history
                HistoryService.addHistory(navState.url, navState.title);
              }
            }}
            onError={(syntheticEvent) => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            allowsBackForwardNavigationGestures={true}
            decelerationRate="normal"
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        ))}
      </View>

      <NavigationBar
        canGoBack={activeTab?.canGoBack || false}
        canGoForward={activeTab?.canGoForward || false}
        onGoBack={goBack}
        onGoForward={goForward}
        onTabs={() => setIsTabViewVisible(true)}
        onBookmarks={() => {}} // Navigate to bookmarks screen
        tabCount={tabs.length}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default BrowserScreen;