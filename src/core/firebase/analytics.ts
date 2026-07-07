import Logger from '../logger';

export const logAnalyticsEvent = async (
  name: string,
  params?: Record<string, any>,
): Promise<void> => {
  Logger.log(`Firebase Analytics Event: ${name}`, params);
};

export const setUserAnalyticsProperties = async (
  properties: Record<string, any>,
): Promise<void> => {
  Logger.log('Firebase Analytics user properties set:', properties);
};
