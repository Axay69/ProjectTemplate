declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '@env' {
  export const API_BEARER_TOKEN: string;
  export const API_ROOT_URL: string;
  export const ENV_KEY: string;
  export const S3_BUCKET_KEY: string;
}
