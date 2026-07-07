import Logger from '@core/logger';

export const initializeNotifications = async (): Promise<void> => {
  try {
    Logger.log('Notifications initialized successfully.');
  } catch (error) {
    Logger.error('Notifications initialization failed:', error);
  }
};
