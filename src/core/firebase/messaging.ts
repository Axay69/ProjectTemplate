import Logger from '../logger';

export const registerForPushNotifications = async (): Promise<boolean> => {
  Logger.log('Registering device token with Firebase Messaging');
  return true;
};

export const subscribeToTopic = async (topic: string): Promise<void> => {
  Logger.log(`Subscribed to Firebase Messaging topic: ${topic}`);
};
