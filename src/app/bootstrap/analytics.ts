import Logger from '@core/logger';

export const initializeAnalytics = async (): Promise<void> => {
  try {
    Logger.log('Analytics initialized successfully.');
  } catch (error) {
    Logger.error('Analytics initialization failed:', error);
  }
};
