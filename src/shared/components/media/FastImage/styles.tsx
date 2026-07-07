import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicStyle: {
    width: scale(70),
    height: scale(70),
    borderRadius: 100,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
