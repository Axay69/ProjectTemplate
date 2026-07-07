import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors, fonts, textVariants } from '@theme';

export const styles = StyleSheet.create({
  profileImage: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(50),
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  loaderView: { position: 'absolute', zIndex: 1 },
  imageView: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageMainView: { alignItems: 'center' },
  imageContainer: {
    alignSelf: 'center',
    borderRadius: 100,
    padding: scale(5),
    borderWidth: 1,
    borderColor: colors.black20,
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
  bottomView: {
    position: 'absolute',
    bottom: scale(45),
    left: scale(20),
    right: scale(20),
  },
  changeProfileImage: {
    ...textVariants.font_13,
    fontFamily: fonts.Semibold,
    color: colors.black50,
  },
});
