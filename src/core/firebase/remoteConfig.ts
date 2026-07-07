import Logger from '@core/logger';

export const fetchRemoteConfigValues = async (): Promise<
  Record<string, any>
> => {
  Logger.log('Fetching configurations from Remote Config');
  return {};
};
