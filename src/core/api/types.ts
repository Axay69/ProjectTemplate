export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  status_code?: number;
  statuscode?: number;
  data?: T;
}

export interface AuthData {
  email_address?: string;
  first_name?: string;
  last_name?: string;
  is_social_login?: boolean;
  social_id?: string;
  social_platform?: string;
  password?: string;
  device_token?: string;
  device_type?: string;
}

export interface GetWebUriRequest {
  content_type: string;
}

export interface EmailPayload {
  email_address: string;
}

export interface VerifyEmailPayload {
  email_address: string;
  otp: number;
}

export interface passwordPayload {
  email_address: string;
  password: string;
}

export interface downloadUrlRequest {
  file_path: string;
}

export interface imageData {
  file_path: string;
  file_type: string;
}

export interface editProfileProps extends Record<string, string> {
  first_name: string;
  last_name: string;
  user_name: string;
  profile_picture: string;
}
