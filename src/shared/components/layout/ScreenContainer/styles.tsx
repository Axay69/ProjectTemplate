import { Platform, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme';

const { width, height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBg: {
    position: 'absolute',
    width,
    height,
  },
  safeAreaContent: {
    flex: 1,
  },
  childrenWrapper: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});
