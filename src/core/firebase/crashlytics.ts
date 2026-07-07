import Logger from '../logger';

export const recordCrashlyticsError = async (
  error: Error,
  context?: string,
): Promise<void> => {
  Logger.error(
    `Firebase Crashlytics Error Logged: ${error.message} (Context: ${
      context ?? 'None'
    })`,
    error,
  );
};

export const setCrashlyticsUser = async (userId: string): Promise<void> => {
  Logger.log(`Firebase Crashlytics user identifier set: ${userId}`);
};
