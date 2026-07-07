// Navigation exports - clean barrel exports
export { default as MainNavigator } from './navigators/MainNavigator';
export { default as AuthNavigator } from './navigators/AuthNavigator';
export { default as DashboardNavigator } from './navigators/DashboardNavigator';

// Hooks
export {
  useAuthNavigation,
  useDashboardNavigation,
  useRootNavigation,
  useNavigationState,
} from './hooks';

// Types and Constants
export type {
  AuthStackParamList,
  DashboardStackParamList,
  RootStackParamList,
  AuthStackNavigationProp,
  DashboardStackNavigationProp,
  RootStackNavigationProp,
} from './types';

export { SCREEN_NAMES, NAVIGATION_OPTIONS } from './routes';
export { linking } from './linking/index';
