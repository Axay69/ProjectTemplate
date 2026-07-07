export interface GetWebUriRequest {
  content_type: string;
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
