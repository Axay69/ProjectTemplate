import { Platform, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { fonts, colors, textVariants } from '@theme/index';

export const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: scale(20),
    flex: 1,
  },
  welcomeText: {
    ...textVariants.font_20,
    color: colors.BLACK,
    textAlign: 'center',
    fontFamily: fonts.Semibold,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 16,
    height: 98,
  },
  descriptionText: {
    ...textVariants.font_13,
    color: colors.black50,
    alignSelf: 'center',
    fontFamily: fonts.Regular,
  },
  inputContainer: {
    justifyContent: 'center',
    marginTop: 80,
  },
  forgotPasswordText: {
    ...textVariants.font_14,
    alignSelf: 'flex-end',
    color: colors.BLACK,
    fontFamily: fonts.Medium,
  },
  continueWithContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(50),
    justifyContent: 'space-between',
  },
  separatorLine: {
    height: 1,
    width: scale(40),
    backgroundColor: colors.black20,
    alignSelf: 'center',
    marginTop: 2,
  },
  continueWithText: {
    ...textVariants.font_14,
    fontFamily: fonts.Regular,
    color: colors.black50,
  },
  socialContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    ...(Platform.OS === 'ios'
      ? { width: 135, justifyContent: 'space-between' }
      : { width: 60 }),
  },
  socialButton: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: colors.black20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  socialIcon: { alignSelf: 'center', height: 24, width: 24 },
  noAccountText: {
    ...textVariants.font_14,
    textAlign: 'center',
    color: colors.black50,
    alignSelf: 'center',
    padding: 5,
  },
  signUpText: {
    ...textVariants.font_14,
    color: colors.burntOrange,
    fontFamily: fonts.Semibold,
    marginLeft: 5,
  },
});
