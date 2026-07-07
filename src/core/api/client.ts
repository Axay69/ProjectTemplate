import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BEARER_TOKEN } from '@env';
import Logger from '@core/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConfig, { api_root_url, env_key } from './config';
import { store } from '@store';
import {
  handleTokenRefresh,
  handleStatus,
  handleNetworkError,
} from './interceptors';

// Storage keys for caching API root configuration
const STORAGE_BASE_URI = '@api_base_uri';
const STORAGE_ENV_KEY = '@api_env_key';

// Preload cached API root on module load to have base URI ready ASAP
(async () => {
  try {
    const map = await AsyncStorage.getMany([STORAGE_ENV_KEY, STORAGE_BASE_URI]);
    if (map[STORAGE_ENV_KEY] === env_key) {
      if (map[STORAGE_BASE_URI]) {
        ApiConfig.setBaseUri(map[STORAGE_BASE_URI]);
      }

      if (map[STORAGE_BASE_URI]) {
        Logger.log('Loaded API root from cache for env:', env_key);
      }
    }
  } catch (e) {
    Logger.log('Failed to preload cached API root:', e);
  }
})();

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  status_code?: number;
  statuscode?: number;
  data?: T;
}

class Api {
  /**
   * Set default headers for all requests
   */
  static defaultHeader(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      axios.defaults.headers.common[key] = value;
    });
  }

  /**
   * Get current authorization header from store
   */
  private static getAuthHeader(): Record<string, string> {
    const state = store.getState();
    const token = state.auth.apiHeader;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  }

  /**
   * Normalize endpoint with base URL
   */
  private static normalizePath(endpoint: string): string {
    const fullEndpoint = `${ApiConfig.getBaseUri}/${endpoint}`;
    Logger.log('API Endpoint:', fullEndpoint);
    return fullEndpoint;
  }

  /**
   * Generic request handler with automatic token refresh
   */
  private static async request<T = any>(
    method: AxiosRequestConfig['method'],
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
    isFormData = false,
    isRetry = false,
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: this.normalizePath(endpoint),
        headers: {
          'Content-Type': isFormData
            ? 'multipart/form-data'
            : 'application/json',
          ...this.getAuthHeader(), // Automatically include auth header from store
          ...headers,
        },
        validateStatus: status => status !== 404,
      };

      if (method === 'GET') config.params = params;
      else config.data = isFormData ? params : JSON.stringify(params);

      const response: AxiosResponse<ApiResponse<T>> = await axios(config);

      // Check for 401 error and attempt token refresh
      const code =
        response.data?.status_code ??
        response.data?.statuscode ??
        response.status;

      Logger.log(`endpoint: ${endpoint} Request`, {
        params,
        response: response.data,
      });

      if (code === 401 && !isRetry) {
        Logger.log('401 error detected, attempting token refresh...');

        const newToken = await handleTokenRefresh();

        if (newToken) {
          Logger.log(
            'Token refreshed successfully, retrying original request...',
          );
          // Retry the original request with new token
          return this.request<T>(
            method,
            endpoint,
            params,
            headers,
            isFormData,
            true,
          );
        } else {
          Logger.log('Token refresh failed, logging out user...');
          handleStatus(response.data);
          return response.data;
        }
      }

      handleStatus(response.data);
      return response.data;
    } catch (error) {
      Logger.log(`${method} Error:`, error);
      return handleNetworkError<T>();
    }
  }

  /**
   * API ROOT call
   */
  public static async API_ROOT<T = any>(
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get<ApiResponse<T>>(api_root_url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_BEARER_TOKEN}`,
        },
        validateStatus: status => status !== 404,
      });

      handleStatus(response.data);
      const anyData = response.data as ApiResponse<any>;

      Logger.log('API_ROOT', anyData);

      if (anyData.success && anyData.data?.url) {
        ApiConfig.setBaseUri(anyData.data.url);
      }

      // Persist to AsyncStorage so next launch can load cached values immediately
      try {
        const ops: Array<[string, string]> = [[STORAGE_ENV_KEY, env_key]];
        if (anyData?.data?.url) {
          ops.push([STORAGE_BASE_URI, anyData.data.url]);
        }
        if (ops.length > 0) {
          const entriesToSet: Record<string, string> = {};
          ops.forEach(([k, v]) => {
            if (v) entriesToSet[k] = v;
          });
          await AsyncStorage.setMany(entriesToSet);
          Logger.log('API root persisted to AsyncStorage for env:', env_key);
        }
      } catch (persistErr) {
        Logger.log('Failed to persist API root:', persistErr);
      }

      return response.data;
    } catch (error) {
      Logger.log('API_ROOT api error:', error);

      return handleNetworkError<T>();
    }
  }

  /** GET request */
  public static GET<T = any>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>('GET', endpoint, params, headers, false, false);
  }

  /** POST request */
  public static POST<T = any>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>('POST', endpoint, params, headers, false, false);
  }

  /** PUT request */
  public static PUT<T = any>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>('PUT', endpoint, params, headers, false, false);
  }

  /** PATCH request */
  public static PATCH<T = any>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>('PATCH', endpoint, params, headers, false, false);
  }
  /** DELETE request */
  public static DELETE<T = any>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>('DELETE', endpoint, params, headers, false, false);
  }

  /** POST with FormData */
  public static POSTFORMDATA<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
  ) {
    const formData = new FormData();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
    }
    return this.request<T>('POST', endpoint, formData, headers, true, false);
  }
}

const apiInstance = new Api();
export { Api };
export default apiInstance;
