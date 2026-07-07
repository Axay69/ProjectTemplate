import { StyleSheet } from 'react-native';
import { colors, fonts, textVariants } from '@theme';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  button: {
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
  },
  text: {
    ...textVariants.font_14,
    color: colors.WHITE,
    fontFamily: fonts.Semibold,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
});
