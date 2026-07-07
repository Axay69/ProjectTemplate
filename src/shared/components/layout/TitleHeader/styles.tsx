import { StyleSheet } from 'react-native';
import { colors, fonts, textVariants } from '@theme';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
  },
  leftWrap: {
    width: scale(28),
    height: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    width: scale(24),
    height: scale(24),
  },

  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  titleTxt: {
    ...textVariants.font_16,
    fontFamily: fonts.Semibold,
    color: colors.BLACK,
  },
  rightWrap: {
    width: scale(28),
    height: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    width: scale(24),
    height: scale(24),
  },
});
