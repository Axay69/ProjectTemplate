import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { colors, fonts, textVariants } from '@theme';

export const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    height: verticalScale(50),
    alignItems: 'center',
    borderRadius: scale(5),
    backgroundColor: colors.black20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInput: {
    ...textVariants.font_15,
    flex: 1,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    height: verticalScale(60),
    fontFamily: fonts.Regular,
    marginHorizontal: scale(20),
    color: colors.BLACK,
  },
  leftIcon: {
    width: scale(24),
    height: verticalScale(24),
    marginRight: scale(7),
    marginLeft: scale(10),
  },
  secureIcon: {
    width: scale(24),
    height: moderateScale(24),
    marginRight: scale(10),
  },
  iconButton: {
    marginLeft: scale(5),
    marginRight: 10,
  },
  applyText: {
    ...textVariants.font_15,
    fontFamily: fonts.Medium,
    paddingHorizontal: scale(10),
  },
  errorStyle: {
    ...textVariants.font_12,

    marginTop: verticalScale(2),
    fontFamily: fonts.Medium,
    color: colors.errorColor,
  },
  mainContainer: { width: '100%' },
  rightText: {
    ...textVariants.font_10,
    color: colors.whiteOverlay30,
    fontFamily: fonts.Regular,
    marginRight: 15,
  },
  userNameDescStyle: {
    ...textVariants.font_12,
    marginTop: verticalScale(2),
    fontFamily: fonts.Medium,
    color: colors.black50,
  },
});
