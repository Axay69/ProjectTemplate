import { Api } from '@core/api';
import {
  downloadUrlRequest,
  editProfileProps,
  GetWebUriRequest,
  imageData,
} from '../types/api';

export async function getWebUri(data: GetWebUriRequest) {
  try {
    const res = await Api.GET('app-content/get', data);
    if (res.success) {
      return { success: res.success, data: res.data, message: res.message };
    } else {
      return { success: res.success, message: res.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function deleteUserAccount() {
  try {
    const response = await Api.DELETE('auth/delete-account', {});

    if (response.success) {
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } else {
      return { success: response.success, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}
export async function downloadGenerateUrl(data: downloadUrlRequest) {
  try {
    const response = await Api.GET('s3-bucket/generate-download-url', data);

    if (response.success) {
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } else {
      return { success: response.success, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function generateImageUrl(data: imageData) {
  try {
    const response = await Api.POST('s3-bucket/generate-upload-url', data);

    if (response.success) {
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } else {
      return { success: response.success, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function deleteGenerateUrl(data: downloadUrlRequest) {
  try {
    const response = await Api.DELETE('s3-bucket/delete-file', data);
    if (response.success) {
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } else {
      return { success: response.success, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function editProfile(data: editProfileProps) {
  try {
    const response = await Api.PATCH('auth/edit-profile', data);

    if (response.success) {
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } else {
      return { success: response.success, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}
