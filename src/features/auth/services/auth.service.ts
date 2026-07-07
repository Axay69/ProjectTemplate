import { Dispatch } from 'redux';
import { Api } from '@core/api';
import { setApiHeader, setUserInfo, UserInfo, resetUser } from '@store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthData,
  EmailPayload,
  passwordPayload,
  VerifyEmailPayload,
} from '../types/api';
import { AppDispatch } from '@store';
import Logger from '@core/logger';
import { TokenStorage } from '@core/storage';

export function setHeader(accessToken: string, refreshToken?: string) {
  return async (dispatch: Dispatch) => {
    // Unified action - handles both cases
    dispatch(setApiHeader({ accessToken, refreshToken }));

    // Save tokens to keychain
    await TokenStorage.saveTokens(accessToken, refreshToken);

    const request = {
      Authorization: `Bearer ${accessToken}`,
    };
    Logger.log('Updated Header:', JSON.stringify(request));
    Api.defaultHeader(request);
  };
}

export function setUserInfoData(data: UserInfo) {
  return (dispatch: Dispatch) => {
    dispatch(setUserInfo(data));
  };
}

export function loginUser(data: AuthData) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await Api.POST('auth/sign-in', data);

      if (response.success) {
        dispatch(setUserInfoData(response.data));
        await dispatch(
          setHeader(response.data.token, response.data.refresh_token),
        );

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
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await Api.POST('auth/refresh-token', {
      refresh_token: refreshToken,
    });

    if (response.success && response.data) {
      const newAccessToken = response.data.token;
      const newRefreshToken = response.data.refresh_token || refreshToken;

      // Save new tokens to keychain
      await TokenStorage.saveTokens(newAccessToken, newRefreshToken);

      return {
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Token refresh failed',
      };
    }
  } catch {
    return {
      success: false,
      message: 'Token refresh failed',
    };
  }
}

export async function checkEmail(data: EmailPayload) {
  try {
    const response = await Api.GET('auth/check-email-address', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function sendVerificationEmail(data: EmailPayload) {
  try {
    const response = await Api.POST('auth/send-verification-email', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function verifyOtp(data: VerifyEmailPayload) {
  try {
    const response = await Api.POST('auth/verify-otp', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function verifyEmail(data: VerifyEmailPayload) {
  try {
    const response = await Api.POST('auth/verify-email', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export function registerUser(data: AuthData) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await Api.POST('auth/sign-up', data);

      if (response.success) {
        dispatch(setUserInfoData(response.data));
        await dispatch(
          setHeader(response.data.token, response.data.refresh_token),
        );

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
  };
}

export async function forgotPassword(data: EmailPayload) {
  try {
    const response = await Api.POST('auth/forgot-password', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}
export async function resetPassword(data: passwordPayload) {
  try {
    const response = await Api.POST('auth/reset-password', data);

    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch {
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

/**
 * Initialize tokens from keychain on app startup
 * This should be called early in the app lifecycle
 */
export function initializeTokensFromKeychain() {
  return async (dispatch: AppDispatch) => {
    try {
      const { accessToken, refreshToken } = await TokenStorage.getTokens();

      if (accessToken) {
        // Restore tokens to Redux state and set API headers
        await dispatch(setHeader(accessToken, refreshToken || undefined));
        Logger.log('Tokens restored from keychain on app startup');
      } else {
        Logger.log('No tokens found in keychain');
      }
    } catch (error) {
      Logger.error('Error initializing tokens from keychain:', error);
    }
  };
}

export function logoutUser() {
  return (dispatch: Dispatch) => {
    dispatch(resetUser());
    (async () => {
      try {
        // Clear tokens from keychain
        await TokenStorage.clearAllTokens();
        // Clear AsyncStorage (for other cached data)
        await AsyncStorage.clear();
      } catch (e) {
        Logger.error('Error clearing storage', e);
      }
    })();
  };
}

export async function logoutUserAccount() {
  try {
    const response = await Api.POST('auth/logout', {});

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
