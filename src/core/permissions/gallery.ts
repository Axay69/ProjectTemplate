import { PermissionsAndroid, Platform } from 'react-native';
import Logger from '../logger';

export const requestGalleryPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version as number;
      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  } catch (error) {
    Logger.error('Error requesting gallery permission:', error);
    return false;
  }
};
