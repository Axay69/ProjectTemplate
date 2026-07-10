import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ReduxProvider } from './ReduxProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider>
    <SafeAreaProvider>
      <KeyboardProvider>{children}</KeyboardProvider>
    </SafeAreaProvider>
  </ReduxProvider>
);
export default AppProviders;
