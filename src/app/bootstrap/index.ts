import { initializeFirebase } from './firebase';
import { initializeStorage } from './storage';
import { initializeNotifications } from './notifications';
import { initializeAnalytics } from './analytics';
import Logger from '@core/logger';

export const bootstrap = async (): Promise<void> => {
  try {
    Logger.log('Starting application bootstrap...');
    await Promise.all([
      initializeFirebase(),
      initializeStorage(),
      initializeNotifications(),
      initializeAnalytics(),
    ]);
    Logger.log('Application bootstrap completed successfully.');
  } catch (error) {
    Logger.error('Bootstrap failed:', error);
  }
};
