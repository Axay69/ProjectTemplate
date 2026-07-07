// Navigation screen names and constants

export const SCREEN_NAMES = {
  // Auth Stack Screens
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen',
  CODE_VERIFICATION: 'CodeVerificationScreen',
  RESET_PASSWORD: 'ResetPasswordScreen',

  // Dashboard Stack Screens
  HOME: 'HomeScreen',
  PROFILE: 'ProfileScreen',
  SETTINGS: 'SettingsScreen',
  QUIZ: 'QuizScreen',
  RESULTS: 'ResultsScreen',
  WEBVIEW_SCREEN: 'WebViewScreen',
  EDIT_PROFILE: 'EditProfileScreen',

  // Root Stack Screens
  AUTH_STACK: 'AuthStack',
  DASHBOARD_STACK: 'DashboardStack',
  ONBOARDING_STACK: 'OnboardingStack',
} as const;

// Navigation options constants
export const NAVIGATION_OPTIONS = {
  // Screen options
  HIDE_HEADER: { headerShown: false },
  SHOW_HEADER: { headerShown: true },

  // Animation options
  DEFAULT_ANIMATION: 'default',
  FADE_ANIMATION: 'fade',
  SLIDE_ANIMATION: 'slide_from_right',

  // Transition presets
  MODAL_TRANSITION: 'modal',
  CARD_TRANSITION: 'card',
  SLIDE_TRANSITION: 'slide_from_bottom',
} as const;
