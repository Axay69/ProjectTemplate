import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '@theme';
import { scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    width: width * 0.9,
    backgroundColor: colors.WHITE,
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  iconContainer: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.ExtraBold,
    color: colors.text,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: verticalScale(15),
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: 'rgba(51, 51, 51, 0.7)',
    textAlign: 'center',
    lineHeight: scale(22),
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(30),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  baseButton: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButton: {
    borderWidth: 1,
    borderColor: 'rgba(51, 51, 51, 0.2)',
    backgroundColor: colors.WHITE,
  },
  laterText: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: 'rgba(51, 51, 51, 0.5)',
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  updateText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.WHITE,
  },
  fullWidthButton: {
    flex: 0,
    width: '100%',
  },
});
