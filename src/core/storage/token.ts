import * as Keychain from 'react-native-keychain';
import Logger from '@core/logger';

// Keychain service identifiers
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const KEYCHAIN_SERVICE = 'com.snatched.keychain';

/**
 * TokenStorage - Secure token storage using react-native-keychain
 * Provides secure storage for access and refresh tokens
 */
class TokenStorage {
  /**
   * Save access token to keychain
   */
  static async saveAccessToken(token: string): Promise<boolean> {
    try {
      const result = await Keychain.setGenericPassword(
        ACCESS_TOKEN_KEY,
        token,
        {
          service: KEYCHAIN_SERVICE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );
      Logger.log('Access token saved to keychain');
      return !!result;
    } catch (error) {
      Logger.error('Error saving access token to keychain:', error);
      return false;
    }
  }

  /**
   * Save refresh token to keychain
   */
  static async saveRefreshToken(token: string): Promise<boolean> {
    try {
      // Use a separate service identifier for refresh token
      const result = await Keychain.setGenericPassword(
        REFRESH_TOKEN_KEY,
        token,
        {
          service: `${KEYCHAIN_SERVICE}.refresh`,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );
      Logger.log('Refresh token saved to keychain');
      return !!result;
    } catch (error) {
      Logger.error('Error saving refresh token to keychain:', error);
      return false;
    }
  }

  /**
   * Save both access and refresh tokens
   */
  static async saveTokens(
    accessToken: string,
    refreshToken?: string,
  ): Promise<boolean> {
    try {
      const accessResult = await this.saveAccessToken(accessToken);
      let refreshResult = true;

      if (refreshToken) {
        refreshResult = await this.saveRefreshToken(refreshToken);
      }

      return accessResult && refreshResult;
    } catch (error) {
      Logger.error('Error saving tokens to keychain:', error);
      return false;
    }
  }

  /**
   * Get access token from keychain
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });

      if (credentials && credentials.password) {
        Logger.log('Access token retrieved from keychain');
        return credentials.password;
      }

      return null;
    } catch (error) {
      Logger.error('Error getting access token from keychain:', error);
      return null;
    }
  }

  /**
   * Get refresh token from keychain
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}.refresh`,
      });

      if (credentials && credentials.password) {
        Logger.log('Refresh token retrieved from keychain');
        return credentials.password;
      }

      return null;
    } catch (error) {
      Logger.error('Error getting refresh token from keychain:', error);
      return null;
    }
  }

  /**
   * Get both tokens from keychain
   */
  static async getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(),
        this.getRefreshToken(),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      Logger.error('Error getting tokens from keychain:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  /**
   * Clear access token from keychain
   */
  static async clearAccessToken(): Promise<boolean> {
    try {
      const result = await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      Logger.log('Access token cleared from keychain');
      return result;
    } catch (error) {
      Logger.error('Error clearing access token from keychain:', error);
      return false;
    }
  }

  /**
   * Clear refresh token from keychain
   */
  static async clearRefreshToken(): Promise<boolean> {
    try {
      const result = await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}.refresh`,
      });
      Logger.log('Refresh token cleared from keychain');
      return result;
    } catch (error) {
      Logger.error('Error clearing refresh token from keychain:', error);
      return false;
    }
  }

  /**
   * Clear all tokens from keychain
   */
  static async clearAllTokens(): Promise<boolean> {
    try {
      const [accessResult, refreshResult] = await Promise.all([
        this.clearAccessToken(),
        this.clearRefreshToken(),
      ]);
      Logger.log('All tokens cleared from keychain');
      return accessResult && refreshResult;
    } catch (error) {
      Logger.error('Error clearing tokens from keychain:', error);
      return false;
    }
  }
}

export default TokenStorage;
