import { StyleSheet } from 'react-native';
import { colors, fonts, textVariants } from '@theme';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  contentContainer: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  title: {
    ...textVariants.font_20,
    fontFamily: fonts.Bold,
    color: colors.BLACK,
    marginBottom: 8,
  },
  message: {
    ...textVariants.font_14,
    fontFamily: fonts.Medium,
    textAlign: 'center',
    color: colors.black50,
  },
  description: {
    ...textVariants.font_13,
    fontFamily: fonts.Regular,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.black50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonView: {
    flex: 1,
    paddingVertical: scale(15),
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: colors.BLACK,
  },
  buttonText: {
    ...textVariants.font_14,
    color: colors.WHITE,
    fontFamily: fonts.Bold,
  },
});
