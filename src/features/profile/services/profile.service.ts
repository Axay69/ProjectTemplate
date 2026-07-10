import { Api } from '@core/api';
import { ENDPOINTS } from '@core/api/endpoints';
import {
  downloadUrlRequest,
  editProfileProps,
  GetWebUriRequest,
  imageData,
} from '../types/api';

export async function getWebUri(data: GetWebUriRequest) {
  try {
    const res = await Api.GET(ENDPOINTS.APP_CONTENT.GET, data);
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
    const response = await Api.DELETE(ENDPOINTS.AUTH.DELETE_ACCOUNT, {});

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
    const response = await Api.GET(ENDPOINTS.S3.GENERATE_DOWNLOAD_URL, data);

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
    const response = await Api.POST(ENDPOINTS.S3.GENERATE_UPLOAD_URL, data);

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
    const response = await Api.DELETE(ENDPOINTS.S3.DELETE_FILE, data);
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
    const response = await Api.PATCH(ENDPOINTS.AUTH.EDIT_PROFILE, data);

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
