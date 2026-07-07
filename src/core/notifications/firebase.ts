import Logger from '../logger';

export const handleFirebaseNotification = async (
  message: any,
): Promise<void> => {
  Logger.log(
    'Processing incoming Firebase Cloud Notification message object:',
    message,
  );
};
