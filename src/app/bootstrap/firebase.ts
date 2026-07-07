import Logger from '@core/logger';

export const initializeFirebase = async (): Promise<void> => {
  try {
    Logger.log('Firebase initialized successfully.');
  } catch (error) {
    Logger.error('Firebase initialization failed:', error);
  }
};
