import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { fonts, colors, textVariants } from '@theme';

export const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: verticalScale(30),
    borderWidth: 1.5,
    borderColor: colors.inputBorderColor,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: scale(8),
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    elevation: 5,
    overflow: 'hidden',
  },
  containerFocused: {
    borderColor: colors.borderTintColor,
  },
  containerError: {
    borderColor: colors.errorColor,
  },
  textInput: {
    ...textVariants.font_13,
    lineHeight: undefined,
    flex: 1,
    height: verticalScale(45),
    paddingVertical: 0,
    fontFamily: fonts.Regular,
    marginLeft: scale(8),
    marginRight: scale(10),
    color: colors.text,
  },
  leftIcon: {
    width: scale(24),
    height: verticalScale(24),
    marginLeft: scale(10),
  },
  secureIcon: {
    width: scale(24),
    height: moderateScale(24),
    marginRight: scale(10),
  },
  iconButton: {
    marginLeft: scale(5),
    marginRight: scale(4),
  },
  applyText: {
    ...textVariants.font_15,
    fontFamily: fonts.Medium,
    paddingHorizontal: scale(10),
  },
  errorStyle: {
    ...textVariants.font_13,
    marginTop: verticalScale(2),
    fontFamily: fonts.Medium,
    color: colors.errorColor,
  },
  mainContainer: {
    marginBottom: 0,
    marginTop: 0,
  },
  label: {
    ...textVariants.font_13,
    fontFamily: fonts.Semibold,
    color: 'rgba(51, 51, 51, 1)',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  rightLabel: {
    ...textVariants.font_10,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  rightText: {
    ...textVariants.font_13,
    color: colors.whiteOverlay30,
    fontFamily: fonts.Regular,
    marginRight: 15,
  },
  rightIconContainer: {
    paddingHorizontal: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    width: scale(20),
    height: scale(20),
  },
  userNameDescStyle: {
    ...textVariants.font_12,
    marginTop: verticalScale(2),
    fontFamily: fonts.Regular,
    color: colors.black50,
  },
});
