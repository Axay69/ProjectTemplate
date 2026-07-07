import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors, fonts, textVariants } from '@theme';

export const styles = StyleSheet.create({
  imageMainView: {
    alignSelf: 'center',
    borderRadius: 100,
    padding: scale(5),
    borderWidth: 1,
    borderColor: colors.black20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loader: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerMainView: {
    marginHorizontal: scale(20),
  },
  fastImages: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(50),
  },
  nickNameTxt: {
    ...textVariants.font_13,
    fontFamily: fonts.Semibold,
    color: colors.black50,
    alignSelf: 'center',
    maxWidth: '80%',
  },
  nameTxt: {
    ...textVariants.font_17,
    fontFamily: fonts.Semibold,
    color: colors.BLACK,
    alignSelf: 'center',
    maxWidth: '80%',
    textAlign: 'center',
  },
  emailTxt: {
    ...textVariants.font_14,
    fontFamily: fonts.Semibold,
    color: colors.black50,
    alignSelf: 'center',
    marginStart: scale(8),
  },
  viewLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.black20,
  },
  emailIcon: {
    width: scale(18),
    height: scale(18),
  },
  emailView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAccountContainer: {
    position: 'absolute',
    bottom: scale(30),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  deleteAccountButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
  },
  deleteAccountText: {
    ...textVariants.font_14,
    fontFamily: fonts.Bold,
    color: colors.pastelRed,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
