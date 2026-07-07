import { StyleSheet } from 'react-native';
import { colors, fonts, textVariants } from '@theme';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  marginContainer: {
    marginHorizontal: 20,
  },
  backButtonView: { height: 30, width: 30, justifyContent: 'center' },
  backButtonImg: { height: 24, width: 24, alignSelf: 'center' },
  resetYourPasswordText: {
    ...textVariants.font_24,
    color: colors.BLACK,
    fontFamily: fonts.Semibold,
  },
  resetYourPasswordDesc: {
    ...textVariants.font_13,
    color: colors.black50,
    fontFamily: fonts.Regular,
  },
  bottomView: {
    position: 'absolute',
    bottom: scale(45),
    left: scale(20),
    right: scale(20),
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainerStyle: { flexGrow: 1, paddingBottom: scale(25) },
  notReceiveCode: {
    ...textVariants.font_15,
    color: colors.whiteOverlay80,
    fontFamily: fonts.Regular,
  },
});
