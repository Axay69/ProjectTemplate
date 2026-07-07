import Logger from '../logger';

export const setupConnectivityListener = (
  onChange: (isConnected: boolean) => void,
): (() => void) => {
  Logger.log('Registering network connectivity state listener');
  return () => {
    Logger.log('Unsubscribing connectivity state listener');
  };
};
