import { PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import Logger from '../logger';

export const requestUserPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version as number;
      if (apiLevel <= 32) {
        Logger.debug('Android <33: notification permission auto-granted');
        return true;
      }
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      Logger.debug('Android Notification Permission:', result);
      return granted;
    } else {
      const messaging = getMessaging(getApp());
      const authStatus = await requestPermission(messaging, {
        alert: true,
        badge: true,
        sound: true,
      });
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
      Logger.debug('iOS Notification Permission:', authStatus);
      return enabled;
    }
  } catch (error) {
    Logger.error('Error requesting notification permission:', error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging(getApp());
    const token = await getToken(messaging);
    Logger.debug('FCM Token:', token);
    return token;
  } catch (err) {
    Logger.error('FCM token error:', err);

    // Retry once after a delay for FIS_AUTH_ERROR
    if (err instanceof Error && err.message.includes('FIS_AUTH_ERROR')) {
      Logger.warn(
        'Retrying FCM token fetch after 2 seconds due to FIS_AUTH_ERROR',
      );
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      try {
        const messaging = getMessaging(getApp());
        const token = await getToken(messaging);
        Logger.debug('FCM Token (retry):', token);
        return token;
      } catch (retryErr) {
        Logger.error('FCM token retry failed:', retryErr);
      }
    }

    return null;
  }
};

export const initFCM = async (): Promise<string | null> => {
  const enabled = await requestUserPermission();
  if (enabled) return await getFCMToken();
  Logger.warn('Notification permissions not granted');
  return null;
};
