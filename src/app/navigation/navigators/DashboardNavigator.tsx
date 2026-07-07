import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from '../types';
import { SCREEN_NAMES, NAVIGATION_OPTIONS } from '../routes';
import { HomeScreen } from '@features/home';
import { ProfileScreen, EditProfileScreen } from '@features/profile';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...NAVIGATION_OPTIONS.HIDE_HEADER,
        animation: NAVIGATION_OPTIONS.SLIDE_ANIMATION,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName={SCREEN_NAMES.HOME}
    >
      <Stack.Screen
        name={SCREEN_NAMES.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
