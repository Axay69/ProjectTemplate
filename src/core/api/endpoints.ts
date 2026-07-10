export const urls = {
  android_app_url:
    'https://play.google.com/store/apps/details?id=com.quizconnect',
  ios_app_url: 'https://apps.apple.com/in/app/foodculture/id6753670784',
};

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: 'auth/sign-in',
    SIGN_UP: 'auth/sign-up',
    REFRESH_TOKEN: 'auth/refresh-token',
    CHECK_EMAIL: 'auth/check-email-address',
    SEND_VERIFICATION_EMAIL: 'auth/send-verification-email',
    VERIFY_OTP: 'auth/verify-otp',
    VERIFY_EMAIL: 'auth/verify-email',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password',
    LOGOUT: 'auth/logout',
    DELETE_ACCOUNT: 'auth/delete-account',
    EDIT_PROFILE: 'auth/edit-profile',
  },
  APP_CONTENT: {
    GET: 'app-content/get',
  },
  S3: {
    GENERATE_DOWNLOAD_URL: 's3-bucket/generate-download-url',
    GENERATE_UPLOAD_URL: 's3-bucket/generate-upload-url',
    DELETE_FILE: 's3-bucket/delete-file',
  },
} as const;
