export const DEEP_LINK_SCHEMES = ['snatched://', 'https://snatched.com'];

export const linkingConfig = {
  prefixes: DEEP_LINK_SCHEMES,
  config: {
    screens: {
      LoginScreen: 'login',
      ForgotPasswordScreen: 'forgot-password',
      DashboardScreen: 'dashboard',
    },
  },
};
