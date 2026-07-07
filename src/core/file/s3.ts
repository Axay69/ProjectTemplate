import { s3_bucket_key } from '@core/api';
import {
  deleteGenerateUrl,
  generateImageUrl,
} from '@features/profile/services/profile.service';
import Logger from '@core/logger';

export interface ImageData {
  uri?: string;
  name?: string;
  type?: string;
}

// Define S3 paths here so they don't get included in i18n/localization
const S3_PATHS = {
  profile_images: 'profile_images',
  // Add other S3 paths here as needed
};

const uploadImageToS3Bucket = async (
  file: ImageData,
  folder: string = S3_PATHS.profile_images,
): Promise<string | null> => {
  try {
    if (!file.uri || !file.name) {
      throw new Error('Invalid file data');
    }

    // Generate unique filename
    const filename = `${Date.now()}_${file.name}`;

    // Ask backend for signed upload URL
    const params = {
      file_path: `${s3_bucket_key}/${folder}/${filename}`,
      file_type: file.type || 'image/jpeg',
    };

    const generateUrlRequest = await generateImageUrl(params);

    if (!generateUrlRequest.success) {
      throw new Error('Failed to generate S3 upload URL');
    }

    // Convert local file → blob
    const fileResponse = await fetch(file.uri);
    const imageBlob = await fileResponse.blob();

    // Upload to S3 using pre-signed URL
    const response = await fetch(generateUrlRequest.data.uploadUrl, {
      method: 'PUT',
      body: imageBlob,
      headers: { 'Content-Type': file.type || 'image/jpeg' },
    });

    if (!response.ok) {
      Logger.log('Failed to upload image to S3', JSON.stringify(response));
      return null;
    }

    Logger.log('✅ Upload successful:', generateUrlRequest.data.filePath);
    return generateUrlRequest.data.filePath; // path you can store in DB
  } catch (error) {
    Logger.log('Error uploading file:', error);
    return null;
  }
};

const deleteImageToS3Bucket = async (fileKey: string): Promise<boolean> => {
  try {
    const params = { file_path: fileKey };
    const response = await deleteGenerateUrl(params);

    if (response.success) {
      Logger.log(`✅ File deleted successfully: ${fileKey}`);
      return true;
    } else {
      Logger.log('❌ Failed to delete file:', response.message);
      return false;
    }
  } catch (error) {
    Logger.log('Error deleting file:', error);
    return false;
  }
};

export { uploadImageToS3Bucket, deleteImageToS3Bucket };
