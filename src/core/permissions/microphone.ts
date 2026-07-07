import { PermissionsAndroid, Platform } from 'react-native';
import Logger from '../logger';

export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (error) {
    Logger.error('Error requesting microphone permission:', error);
    return false;
  }
};
