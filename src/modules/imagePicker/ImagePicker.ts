import { Alert, Linking } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Logger from '@core/logger';
import { strings } from '@shared/constants/index';

const MAX_SIZE = 1024 * 1024;

// Define a proper type for ImagePicker errors
type ImagePickerError = {
  code: string;
  message: string;
};

export interface ImagePickerOptions {
  width?: number;
  height?: number;
  freeStyleCropEnabled?: boolean;
  cropping?: boolean;
  cropperCircleOverlay?: boolean;
}

export const pickAndCompressImage = async (
  options?: ImagePickerOptions,
): Promise<ImageOrVideo | null> => {
  const width = options?.width || 1000;
  const height = options?.height || 1000;
  const shouldCrop = options?.cropping !== false;

  try {
    // STEP 1: Pick image (no cropping by default during pick, NO base64 to prevent OOM crash)
    let image = await ImagePicker.openPicker({
      mediaType: 'photo',
      forceJpg: true,
    });

    // STEP 1.5: Crop the selected image
    if (shouldCrop) {
      image = await ImagePicker.openCropper({
        path: image.path,
        width,
        height,
        freeStyleCropEnabled: options?.freeStyleCropEnabled,
        cropperCircleOverlay: options?.cropperCircleOverlay,
        mediaType: 'photo',
      });
    }

    let quality = 0.9;

    // STEP 2: Keep compressing until under 1MB or quality too low
    while (image.size > MAX_SIZE && quality > 0.1) {
      image = await ImagePicker.openCropper({
        path: image.path,
        width,
        height,
        freeStyleCropEnabled: options?.freeStyleCropEnabled,
        cropperCircleOverlay: options?.cropperCircleOverlay,
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
      { text: strings.cancel, style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
};
