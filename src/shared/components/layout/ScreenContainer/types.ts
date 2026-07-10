import { ViewStyle, StyleProp, RefreshControlProps } from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';
import { HeaderProps } from '../Header';

export type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isHeaderShown?: boolean;
  headerProps?: HeaderProps;
  isGradientBg?: boolean;
  wrapWithScrollview?: boolean;
  edges?: Edge[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isMainTabsScreen?: boolean;
  isStatusBarTranslucent?: boolean;
  statusBarBgColor?: string;
  isBottomTransparent?: boolean;
  keyScrollporps?: Partial<KeyboardAwareScrollViewProps>;
  useCustomKeyboardSpacer?: boolean;
};
