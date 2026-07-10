import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import { fonts } from '@theme';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: scale(10),
  },
  container: {
    minHeight: scale(54),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderLeftWidth: 5,
    paddingRight: scale(10),
  },
  iconContainer: {
    paddingHorizontal: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    height: scale(24),
    width: scale(24),
  },
  textStyle: {
    color: '#333333',
    fontFamily: fonts.Medium,
    fontSize: 15,
    lineHeight: 19,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: scale(10),
  },
  undoContainer: {
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  undoText: {
    color: '#3292FF',
    fontFamily: fonts.Bold,
    fontSize: 14,
  },
});
