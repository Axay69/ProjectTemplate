import { store } from '@store';
import NetInfo from '@react-native-community/netinfo';
import { ToastManager } from '@shared/utils/toast/ToastManager';
import { strings } from '@shared/constants/index';
import {
  logoutUser,
  refreshAccessToken,
  setHeader,
} from '@features/auth/services/auth.service';
import Logger from '@core/logger';
import { ApiResponse } from './types';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function handleTokenRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh();

  try {
    const newToken = await refreshPromise;
    return newToken;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

async function performTokenRefresh(): Promise<string | null> {
  try {
    const state = store.getState();
    const refreshToken = state.auth.userInfo?.refresh_token;

    if (!refreshToken) {
      ToastManager.showError(strings.session_logout);
      store.dispatch(logoutUser());
      return null;
    }

    const refreshResult = await refreshAccessToken(refreshToken);

    if (refreshResult.success && refreshResult.accessToken) {
      await store.dispatch(
        setHeader(refreshResult.accessToken, refreshResult.refreshToken),
      );
      return refreshResult.accessToken;
    } else {
      Logger.log('Token refresh failed:', refreshResult.message);
      ToastManager.showError(strings.session_logout);
      store.dispatch(logoutUser());
      return null;
    }
  } catch (error) {
    Logger.log('Token refresh error:', error);
    ToastManager.showError(strings.session_logout);
    store.dispatch(logoutUser());
    return null;
  }
}

export function handleStatus(response: ApiResponse): void {
  const code = response.status_code ?? response.statuscode ?? 0;
  if ([101, 401, 403].includes(code)) {
    if (code === 401) {
      ToastManager.showError(strings.session_logout);
    }
    isRefreshing = false;
    refreshPromise = null;
    store.dispatch(logoutUser());
  }
}

export async function handleNetworkError<T = any>(): Promise<ApiResponse<T>> {
  const state = await NetInfo.fetch();
  return {
    success: false,
    message: state.isConnected
      ? 'Oops! Something went wrong'
      : 'You are currently offline',
    status_code: 0,
  };
}
