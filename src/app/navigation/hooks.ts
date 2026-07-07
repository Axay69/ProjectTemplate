// Custom navigation hooks for type safety and better UX

import { useNavigation, CommonActions } from '@react-navigation/native';
import { useCallback } from 'react';
import { SCREEN_NAMES } from './routes';
import type { AuthStackNavigationProp, RootStackNavigationProp } from './types';

// Auth Stack Navigation Hook
export const useAuthNavigation = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();

  const navigateToLogin = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.LOGIN as never);
  }, [navigation]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.REGISTER as never);
  }, [navigation]);

  const navigateToForgotPassword = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD as never);
  }, [navigation]);

  const navigateToCodeVerification = useCallback(
    (
      params: {
        fromPage?: string;
        registerParams?: any;
        email?: string;
      } = {},
    ) => {
      navigation.navigate(SCREEN_NAMES.CODE_VERIFICATION, params);
    },
    [navigation],
  );

  const navigateToResetPassword = useCallback(
    (
      params: {
        email?: string;
      } = {},
    ) => {
      navigation.navigate(SCREEN_NAMES.RESET_PASSWORD, params);
    },
    [navigation],
  );

  const navigateToWebViewScreen = useCallback(
    (params: { title: string; uriType: string }) => {
      // Navigate to root-level WebViewScreen to work from any stack
      rootNavigation.dispatch(
        CommonActions.navigate({
          name: SCREEN_NAMES.WEBVIEW_SCREEN as never,
          params: params as never,
        }),
      );
    },
    [rootNavigation],
  );

  return {
    ...navigation,
    navigateToLogin,
    navigateToRegister,
    navigateToForgotPassword,
    navigateToWebViewScreen,
    navigateToCodeVerification,
    navigateToResetPassword,
  };
};

// Dashboard Stack Navigation Hook
export const useDashboardNavigation = () => {
  const navigation = useNavigation();

  const navigateToHome = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.HOME as never);
  }, [navigation]);

  const navigateToProfile = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.PROFILE as never);
  }, [navigation]);

  const navigateToSettings = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.SETTINGS as never);
  }, [navigation]);

  const navigateToQuiz = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.QUIZ as never);
  }, [navigation]);

  const navigateToResults = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.RESULTS as never);
  }, [navigation]);

  const navigateToEditProfile = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.EDIT_PROFILE as never);
  }, [navigation]);

  return {
    ...navigation,
    navigateToHome,
    navigateToProfile,
    navigateToSettings,
    navigateToQuiz,
    navigateToResults,
    navigateToEditProfile,
  };
};

// Root Stack Navigation Hook
export const useRootNavigation = () => {
  const navigation = useNavigation();

  const navigateToAuth = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.AUTH_STACK as never);
  }, [navigation]);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD_STACK as never);
  }, [navigation]);

  const navigateToOnboarding = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.ONBOARDING_STACK as never);
  }, [navigation]);

  return {
    ...navigation,
    navigateToAuth,
    navigateToDashboard,
    navigateToOnboarding,
  };
};

// Utility hook for navigation state
export const useNavigationState = () => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const resetToScreen = useCallback(
    (screenName: string, params?: Record<string, unknown>) => {
      navigation.reset({
        index: 0,
        routes: [{ name: screenName as never, params }],
      });
    },
    [navigation],
  );

  const popToTop = useCallback(() => {
    // Use goBack as fallback since popToTop may not be available
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return {
    goBack,
    resetToScreen,
    popToTop,
    canGoBack: navigation.canGoBack(),
  };
};
