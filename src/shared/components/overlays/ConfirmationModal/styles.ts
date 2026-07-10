import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors, fonts, textVariants } from '@theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: colors.WHITE,
    borderRadius: scale(20),
    paddingHorizontal: scale(0),
    paddingVertical: verticalScale(30),
    alignItems: 'center',
  },
  iconCircle: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  icon: {
    // width: scale(70),
    // height: scale(70),
  },
  title: {
    ...textVariants.font_27,
    fontFamily: fonts.ExtraBold,
    color: colors.text,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    marginTop: 30,
  },
  message: {
    ...textVariants.font_14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    // marginBottom: verticalScale(24),
    lineHeight: verticalScale(20),
    paddingHorizontal: scale(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
  },
  button: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginRight: scale(10),
    height: verticalScale(50),
  },
  confirmButtonOuter: {
    flex: 1,
    marginLeft: scale(10),
    backgroundColor: colors.primary + '80',
    borderRadius: verticalScale(25),
  },
  confirmGradientWrapper: {
    borderRadius: verticalScale(25),
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    flex: 1,
    margin: scale(2.5),
    height: verticalScale(50) - scale(5),
    borderRadius: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: scale(16),
    fontFamily: fonts.Regular,
    color: colors.lightGray,
  },
  confirmButtonText: {
    fontSize: scale(16),
    fontFamily: fonts.Bold,
    color: colors.WHITE,
  },
});
