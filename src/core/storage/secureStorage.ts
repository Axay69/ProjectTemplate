import * as Keychain from 'react-native-keychain';

export const setSecureItem = async (key: string, value: string) => {
  await Keychain.setGenericPassword(key, value);
};

export const getSecureItem = async (_key: string) => {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
};

export const removeSecureItem = async () => {
  await Keychain.resetGenericPassword();
};
