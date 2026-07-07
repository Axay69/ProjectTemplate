import { API_ROOT_URL } from '@env';

export const getEnvironmentName = (): string => {
  return __DEV__ ? 'development' : 'production';
};

export const getApiUrl = (): string => {
  return API_ROOT_URL || 'http://192.168.29.59:9000/app/v1';
};
