import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E1CF9B',
  },
});
