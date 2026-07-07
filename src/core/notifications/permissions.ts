import Logger from '../logger';

export const requestPushNotificationPermissions =
  async (): Promise<boolean> => {
    Logger.log(
      'Prompting user for iOS/Android notification access permissions',
    );
    return true;
  };
