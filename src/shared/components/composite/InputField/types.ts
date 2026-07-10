import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface InputFieldProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureText?: boolean;
  secureTextOption?: boolean;
  setSecureText?: (secure: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  parentStyle?: StyleProp<ViewStyle>;
  errorMsg?: string;
  leftIcon?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>; // New
  onSubmitEditing?: () => void; // To move focus to the next input
  rightText?: string;
  rightTextStyle?: StyleProp<TextStyle>;
  label?: string | React.ReactNode;
  rightLabel?: string;
  leftIconTintColor?: string;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  onRightIconPress?: () => void;
  InputComponent?: React.ComponentType<TextInputProps>;
  userNameDesc?: string;
  onPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  topComponent?: React.ReactNode;
  isMentionHighlighting?: boolean;
  children?: React.ReactNode;
  noDynamicPlaceholderFonts?: boolean;
}
