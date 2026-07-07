import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types';
import { SCREEN_NAMES, NAVIGATION_OPTIONS } from '../routes';
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  OTPScreen as CodeVerificationScreen,
  ResetPasswordScreen,
} from '@features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...NAVIGATION_OPTIONS.HIDE_HEADER,
        animation: NAVIGATION_OPTIONS.SLIDE_ANIMATION,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName={SCREEN_NAMES.LOGIN}
    >
      <Stack.Screen
        name={SCREEN_NAMES.LOGIN}
        component={LoginScreen}
        options={{
          title: 'Login',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.REGISTER}
        component={RegisterScreen}
        options={{
          title: 'Register',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{
          title: 'ForgotPassword',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CODE_VERIFICATION}
        component={CodeVerificationScreen}
        options={{
          title: 'CodeVerification',
          animationTypeForReplace: 'push',
        }}
      />

      <Stack.Screen
        name={SCREEN_NAMES.RESET_PASSWORD}
        component={ResetPasswordScreen}
        options={{
          title: 'ResetPassword',
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
