import Logger from '../logger';

export const displayLocalNotification = async (
  title: string,
  body: string,
  data?: any,
): Promise<void> => {
  Logger.log(`Displaying local UI push banner: "${title}" - "${body}"`, data);
};
