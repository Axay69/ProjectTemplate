import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors, fonts } from '@theme';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  container: {
    paddingVertical: scale(10),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(10),
    backgroundColor: colors.WHITE,
    borderWidth: 0.7,
  },
  imgStyle: {
    height: scale(25),
    width: scale(25),
    marginHorizontal: scale(15),
  },
  textStyle: {
    color: colors.BLACK,
    fontFamily: fonts.Medium,
    lineHeight: 17,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: scale(10),
  },
});
