import Logger from '../logger';

export const routeFromNotification = (notificationData: any): void => {
  Logger.log(
    'Performing route screen navigation from push notification data payload:',
    notificationData,
  );
};
