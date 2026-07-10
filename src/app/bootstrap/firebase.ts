import Logger from '@core/logger';
import firebase from '@react-native-firebase/app';

// Check if Firebase app is already initialized
export const isFirebaseInitialized = (): boolean => {
  try {
    // Try to get the default app to check if it's initialized
    firebase.app();
    return true;
  } catch {
    return false;
  }
};

export const initializeFirebase = async (): Promise<void> => {
  try {
    // Check if already initialized first
    if (!isFirebaseInitialized()) {
      // @react-native-firebase/app automatically initializes from native config
      // So we just need to access the app to trigger initialization if possible
      firebase.app();
    }
    Logger.log('Firebase initialized successfully.');
  } catch (error) {
    Logger.warn('Firebase initialization skipped (no config found):', error);
  }
};
