import Logger from '@core/logger';

export const isBiometricSupported = async (): Promise<boolean> => {
  Logger.log('Checking if biometric authentication is supported');
  return true;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  Logger.log('Performing biometric authentication');
  return true;
};
