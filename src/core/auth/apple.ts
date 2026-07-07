import Logger from '../logger';

export interface AppleAuthResponse {
  email: string | null;
  fullName: string | null;
  identityToken: string | null;
  authorizationCode: string | null;
}

export const loginWithApple = async (): Promise<AppleAuthResponse | null> => {
  Logger.log('Performing Google/Apple login placeholder');
  return null;
};
