import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors } from '@theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicStyle: {
    width: scale(70),
    height: scale(70),
    borderRadius: 100,
    backgroundColor: colors.surface,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
