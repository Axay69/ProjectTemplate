export { Api, default as api } from './client';
export {
  default as ApiConfig,
  api_root_url,
  env_key,
  s3_bucket_key,
} from './config';
export { urls } from './endpoints';
export * from './types';

// Mock functions to satisfy compiler
export const getUnreadNotificationCount = async () => ({
  success: true,
  data: { unread_count: 0 },
});
export const getBarsiqUnreadCount = async () => ({ success: true, data: 0 });
export const markBarsiqAsRead = async () => ({ success: true });
