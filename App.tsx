import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import BrowserScreen from './src/screens/BrowserScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Browser"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Browser" component={BrowserScreen} />
            <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;