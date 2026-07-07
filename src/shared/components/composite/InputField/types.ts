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
  containerStyle?: ViewStyle;
  textInputStyle?: TextStyle;
  parentStyle?: ViewStyle;
  errorMsg?: string;
  leftIcon?: ImageSourcePropType;
  leftIconStyle?: ImageStyle; // New
  onSubmitEditing?: () => void; // To move focus to the next input
  rightText?: string;
  rightTextStyle?: StyleProp<TextStyle>;
}
