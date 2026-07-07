import Logger from '../logger';

export interface GoogleAuthResponse {
  idToken: string | null;
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export const loginWithGoogle = async (): Promise<GoogleAuthResponse | null> => {
  Logger.log('Performing Google login placeholder');
  return null;
};
