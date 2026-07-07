import { PermissionsAndroid, Platform } from 'react-native';
import Logger from '../logger';

export const requestContactsPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    Logger.error('Error requesting contacts permission:', error);
    return false;
  }
};
