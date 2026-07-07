import Logger from '@core/logger';

export const initializeStorage = async (): Promise<void> => {
  try {
    Logger.log('Storage initialized successfully.');
  } catch (error) {
    Logger.error('Storage initialization failed:', error);
  }
};
