export interface UserInfo {
  id?: number;
  name?: string;
  email_address?: string;
  createdAt?: string;
  device_token?: string;
  device_type?: string;
  is_deleted?: boolean;
  is_social_login?: boolean;
  noti_badge?: number;
  profile_picture?: string;
  profile_url?: string;
  social_media_id?: number;
  social_media_type?: string;
  token?: string;
  updatedAt?: string;
  refresh_token?: string;
  first_name: string;
  last_name: string;
  user_name?: string;
  barsiq_ai_enabled?: boolean;
  barsiq_avatar?: any;
  user_type?: string;
  flare_balance?: number;
}

export interface UserState {
  userInfo: UserInfo | null;
  apiHeader: string | null;
  unreadNotificationCount?: number;
}
