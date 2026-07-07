import Logger from '../logger';

export const configureLocalization = (): void => {
  Logger.log('Initializing user locales configuration bindings');
};

export const translateKey = (key: string): string => {
  return key;
};
