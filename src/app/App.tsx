import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import AppProviders from './providers/AppProviders';
import { MainNavigator } from './navigation';
import { RootActivityIndicator } from '@shared/components';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppProviders>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <MainNavigator />
      <RootActivityIndicator />
    </AppProviders>
  );
}

export default App;
