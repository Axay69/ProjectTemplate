import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReduxProvider } from './ReduxProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider>
    <SafeAreaProvider>{children}</SafeAreaProvider>
  </ReduxProvider>
);
export default AppProviders;
