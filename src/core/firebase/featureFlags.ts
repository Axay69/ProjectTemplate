import Logger from '../logger';

export const isFeatureEnabled = (flagName: string): boolean => {
  Logger.log(`Checking feature flag state: ${flagName}`);
  return false;
};
