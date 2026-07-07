import { StyleSheet } from 'react-native';
import { colors, fonts, textVariants } from '@theme/index';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  marginContainer: {
    marginHorizontal: scale(20),
  },
  backButtonView: { height: 30, width: 30, justifyContent: 'center' },
  backButtonImg: { height: 24, width: 24, alignSelf: 'center' },
  codeVerificationText: {
    ...textVariants.font_24,
    color: colors.BLACK,
    fontFamily: fonts.Semibold,
  },
  codeVerificationDesc: {
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
    color: colors.black40,
    fontFamily: fonts.Regular,
  },
  sendAgain: {
    ...textVariants.font_15,
    color: colors.burntOrange,
    fontFamily: fonts.Bold,
    alignSelf: 'center',
    marginLeft: 5,
    textAlign: 'center',
  },

  didNotReceiveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
