import Logger from '../logger';

export interface UpdateStatus {
  hasUpdate: boolean;
  isForceUpdate: boolean;
  updateUrl: string | null;
}

export const checkForAppUpdates = async (): Promise<UpdateStatus> => {
  Logger.log('Checking for newer app versions in stores');
  return {
    hasUpdate: false,
    isForceUpdate: false,
    updateUrl: null,
  };
};
