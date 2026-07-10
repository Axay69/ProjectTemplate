import Logger from './logger';
import { isFirebaseInitialized } from '@app/bootstrap/firebase';
import firebase from '@react-native-firebase/app';
import type { FirebaseApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

type Auth = ReturnType<typeof auth>;
type Messaging = ReturnType<typeof messaging>;

/**
 * Safely get the default Firebase app
 * Returns null if Firebase is not initialized
 */
export const getSafeApp = (): FirebaseApp | null => {
  if (!isFirebaseInitialized()) {
    return null;
  }
  try {
    return firebase.app();
  } catch (error) {
    Logger.error('Error getting Firebase app:', error);
    return null;
  }
};

/**
 * Safely get Firebase Auth instance
 * Returns null if Firebase is not initialized
 */
export const getSafeAuth = (): Auth | null => {
  const app = getSafeApp();
  if (!app) return null;
  try {
    return auth(app);
  } catch (error) {
    Logger.error('Error getting Firebase auth:', error);
    return null;
  }
};

/**
 * Safely get Firebase Messaging instance
 * Returns null if Firebase is not initialized
 */
export const getSafeMessaging = (): Messaging | null => {
  const app = getSafeApp();
  if (!app) return null;
  try {
    return messaging(app);
  } catch (error) {
    Logger.error('Error getting Firebase messaging:', error);
    return null;
  }
};
