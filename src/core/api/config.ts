import { API_ROOT_URL, ENV_KEY, S3_BUCKET_KEY } from '@env';

// Fallback values if env variables are not set (should not happen in production)
const api_root_url = API_ROOT_URL || 'http://192.168.29.59:9000/app/v1';
const env_key = ENV_KEY || 'local';
const s3_bucket_key = S3_BUCKET_KEY || 'quiz_connect_local';

class ApiConfig {
  private static _baseUri: string = api_root_url;

  static setBaseUri(uri: string) {
    this._baseUri = uri;
  }

  static get getBaseUri(): string {
    return this._baseUri;
  }
}

export default ApiConfig;
export { api_root_url, env_key, s3_bucket_key };
