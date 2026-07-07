import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface TitleHeaderProps {
  title?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: ImageSourcePropType;
  leftIconStyle?: ImageStyle; // New
  onPressLeft?: () => void;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: ImageStyle;
  onPressRight?: () => void;
}
