// Navigation type definitions for better type safety
import { NavigationProp } from '@react-navigation/native';

// TODO: Import RegisterParams when needed
// import { RegisterParams } from '@features/auth/screens/codeVerification/types';

// Auth Stack Parameters
export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  WebViewScreen: { title: string; uriType: string };
  CodeVerificationScreen: {
    fromPage?: string;
    registerParams?: any; // Replace with RegisterParams when available
    email?: string;
  };
  ResetPasswordScreen: {
    email?: string;
  };
};

// Dashboard Stack Parameters
export type DashboardStackParamList = {
  HomeScreen: undefined;
  ProfileScreen: { userId: string };
  SettingsScreen: undefined;
  QuizScreen: { quizId: string };
  ResultsScreen: { quizId: string; score: number };
  EditProfileScreen: { image: string };
};

// Root Stack Parameters
export type RootStackParamList = {
  AuthStack: undefined;
  DashboardStack: undefined;
  OnboardingStack: undefined;
  WebViewScreen: { title: string; uriType: string };
};

// Navigation prop types
export type AuthStackNavigationProp = NavigationProp<AuthStackParamList>;
export type DashboardStackNavigationProp =
  NavigationProp<DashboardStackParamList>;
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
