import { PermissionsAndroid, Platform } from 'react-native';
import Logger from '../logger';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS auto-grants / uses Plist keys requesting automatically on trigger
    return true;
  } catch (error) {
    Logger.error('Error requesting camera permission:', error);
    return false;
  }
};
