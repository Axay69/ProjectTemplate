import Logger from '../logger';

export const checkActiveSession = async (): Promise<boolean> => {
  Logger.log('Checking active user session');
  return true;
};

export const clearSession = async (): Promise<void> => {
  Logger.log('Clearing user session');
};
