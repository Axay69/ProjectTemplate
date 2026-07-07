import { Alert, Linking } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Logger from '@core/logger';

// 1MB in bytes
const MAX_SIZE = 1024 * 1024;

// Define a proper type for ImagePicker errors
type ImagePickerError = {
  code: string;
  message: string;
};

export const pickAndCompressImage = async (): Promise<ImageOrVideo | null> => {
  try {
    // STEP 1: Pick image
    let image = await ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    });

    let quality = 0.9;

    // STEP 2: Keep compressing until under 1MB or quality too low
    while (image.size > MAX_SIZE && quality > 0.1) {
      image = await ImagePicker.openCropper({
        path: image.path,
        width: 1000,
        height: 1000,
        compressImageQuality: quality,
        mediaType: 'photo',
      });

      Logger.log(
        `Compressed @${quality}: ${(image.size / 1024 / 1024).toFixed(2)} MB`,
      );

      quality -= 0.1;
    }

    if (image.size > MAX_SIZE) {
      Logger.log('⚠️ Could not compress below 1MB, final size:', image.size);
    } else {
      Logger.log(
        '✅ Final compressed size:',
        (image.size / 1024 / 1024).toFixed(2),
      );
    }

    return image;
  } catch (error: unknown) {
    // Type guard for ImagePickerError
    if (isImagePickerError(error) && error.code === 'E_NO_LIBRARY_PERMISSION') {
      showPermissionDeniedAlert();
    } else {
      Logger.log('openPicker error:', error);
    }
    return null;
  }
};

const isImagePickerError = (error: unknown): error is ImagePickerError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

const showPermissionDeniedAlert = () => {
  Alert.alert(
    'Permission Required',
    'This app needs access to your photos to select an image. Please enable it in your device settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
};
