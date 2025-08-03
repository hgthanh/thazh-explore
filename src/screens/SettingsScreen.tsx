import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {BookmarkService} from '../services/BookmarkService';
import {HistoryService} from '../services/HistoryService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [settings, setSettings] = useState({
    saveHistory: true,
    blockPopups: true,
    enableJavaScript: true,
    clearCookiesOnExit: false,
    desktopModeDefault: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('thazh_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem('thazh_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(newSettings);
  };

  const clearBrowsingData = () => {
    Alert.alert(
      'Clear Browsing Data',
      'This will delete your browsing history, cookies, and cached data. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await HistoryService.clearHistory();
              // Clear other data if needed
              Alert.alert('Success', 'Browsing data cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear browsing data');
            }
          },
        },
      ]
    );
  };

  const clearBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'This will delete all your bookmarks. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookmarkService.clearAllBookmarks();
              Alert.alert('Success', 'All bookmarks cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear bookmarks');
            }
          },
        },
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all settings to their default values.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              saveHistory: true,
              blockPopups: true,
              enableJavaScript: true,
              clearCookiesOnExit: false,
              desktopModeDefault: false,
            };
            saveSettings(defaultSettings);
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    icon: string;
    value?: boolean;
    onPress?: () => void;
    onToggle?: () => void;
    showArrow?: boolean;
  }> = ({title, subtitle, icon, value, onPress, onToggle, showArrow = false}) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !onToggle}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={20} color="#007AFF" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{false: '#C7C7CC', true: '#34C759'}}
            thumbColor="white"
          />
        )}
        {showArrow && (
          <Icon name="chevron-forward" size={20} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{title: string}> = ({title}) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

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
        
        <Text style={styles.headerTitle}>Settings</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Privacy & Security */}
        <SectionHeader title="Privacy & Security" />
        <View style={styles.section}>
          <SettingItem
            title="Save Browsing History"
            subtitle="Keep track of visited websites"
            icon="time-outline"
            value={settings.saveHistory}
            onToggle={() => toggleSetting('saveHistory')}
          />
          <SettingItem
            title="Block Pop-ups"
            subtitle="Prevent websites from opening pop-up windows"
            icon="shield-outline"
            value={settings.blockPopups}
            onToggle={() => toggleSetting('blockPopups')}
          />
          <SettingItem
            title="Clear Cookies on Exit"
            subtitle="Automatically clear cookies when closing the app"
            icon="trash-outline"
            value={settings.clearCookiesOnExit}
            onToggle={() => toggleSetting('clearCookiesOnExit')}
          />
        </View>

        {/* Website Settings */}
        <SectionHeader title="Website Settings" />
        <View style={styles.section}>
          <SettingItem
            title="Enable JavaScript"
            subtitle="Allow websites to run JavaScript"
            icon="code-outline"
            value={settings.enableJavaScript}
            onToggle={() => toggleSetting('enableJavaScript')}
          />
          <SettingItem
            title="Desktop Mode by Default"
            subtitle="Always request desktop version of websites"
            icon="desktop-outline"
            value={settings.desktopModeDefault}
            onToggle={() => toggleSetting('desktopModeDefault')}
          />
        </View>

        {/* Data Management */}
        <SectionHeader title="Data Management" />
        <View style={styles.section}>
          <SettingItem
            title="Clear Browsing Data"
            subtitle="History, cookies, and cached files"
            icon="refresh-outline"
            onPress={clearBrowsingData}
            showArrow
          />
          <SettingItem
            title="Clear All Bookmarks"
            subtitle="Remove all saved bookmarks"
            icon="bookmark-outline"
            onPress={clearBookmarks}
            showArrow
          />
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingItem
            title="Thazh Explore"
            subtitle="Version 1.0.0"
            icon="information-circle-outline"
            showArrow
          />
          <SettingItem
            title="Default Search Engine"
            subtitle="thazhsearch.wuaze.com"
            icon="search-outline"
            showArrow
          />
        </View>

        {/* Reset */}
        <SectionHeader title="Reset" />
        <View style={styles.section}>
          <SettingItem
            title="Reset to Defaults"
            subtitle="Restore all settings to default values"
            icon="refresh-outline"
            onPress={resetToDefaults}
            showArrow
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thazh Explore Browser v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built with React Native
          </Text>
        </View>
      </ScrollView>
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
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D6D70',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 4,
  },
});

export default SettingsScreen;