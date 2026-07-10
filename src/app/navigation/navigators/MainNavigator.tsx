import React, { useState, useEffect, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DashboardNavigator from './DashboardNavigator';
import AuthNavigator from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from '../routes';
import type { RootStackParamList } from '../types';
import RNBootSplash from 'react-native-bootsplash';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@shared/utils/toast/ToastConfig';
import { Api } from '@core/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { env_key } from '@core/api';
import { StatusBar } from 'react-native';
import { initializeTokensFromKeychain } from '@features/auth/services/auth.service';
import { ErrorBoundary } from '@shared/components';
import WebViewScreen from '@modules/webview/index';
import { RootState, AppDispatch } from '@store';
import { bootstrap } from '@app/bootstrap';

const MainNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const apiHeader = useSelector((state: RootState) => state.auth.apiHeader);

  useEffect(() => {
    const init = async () => {
      console.log('App initializing...', userInfo);
      try {
        // Run bootstrap operations first
        await bootstrap();

        // Initialize tokens from keychain
        await dispatch(initializeTokensFromKeychain());

        await Api.API_ROOT({ environment: env_key });
        const request = {
          Authorization: `Bearer ${apiHeader}`,
        };
        await Api.defaultHeader(request);
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
        await RNBootSplash.hide({ fade: true });
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setTimeout(async () => {
      await RNBootSplash.hide({ fade: true });
    }, 5000);
  }, []);

  if (isLoading) {
    return null; // Or your loading component
  }

  return (
    <ErrorBoundary>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Suspense>
        <NavigationContainer>
          <GestureHandlerRootView>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              {userInfo ? (
                <RootStack.Screen
                  name={SCREEN_NAMES.DASHBOARD_STACK}
                  component={DashboardNavigator}
                />
              ) : (
                <RootStack.Screen
                  name={SCREEN_NAMES.AUTH_STACK}
                  component={AuthNavigator}
                />
              )}
              <RootStack.Screen
                name={SCREEN_NAMES.WEBVIEW_SCREEN}
                component={WebViewScreen}
              />
            </RootStack.Navigator>
            <Toast config={toastConfig} />
          </GestureHandlerRootView>
        </NavigationContainer>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MainNavigator;
