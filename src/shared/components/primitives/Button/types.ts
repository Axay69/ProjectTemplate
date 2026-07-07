import { GestureResponderEvent, TextStyle, ViewStyle } from 'react-native';

export interface CTButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  buttonContainerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  disabled?: boolean;
  otherBGColor?: string;
}
