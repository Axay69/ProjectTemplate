import { PermissionsAndroid, Platform } from 'react-native';
import Logger from '../logger';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    Logger.error('Error requesting location permission:', error);
    return false;
  }
};
