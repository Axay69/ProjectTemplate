import React, { forwardRef, useImperativeHandle } from 'react';
import { View, ImageStyle, StyleProp } from 'react-native';
import FastImage from 'react-native-fast-image';

export interface CustomImageZoomRef {
  reset: () => void;
}

interface CustomImageZoomProps {
  uri: string;
  maxScale?: number;
  doubleTapScale?: number;
  shouldCloseOnSwipeDown?: boolean;
  onSwipeDownRelease?: () => void;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

const CustomImageZoom = forwardRef<CustomImageZoomRef, CustomImageZoomProps>(
  ({ uri, style, resizeMode = 'contain' }, ref) => {
    useImperativeHandle(ref, () => ({
      reset: () => {
        // No-op for placeholder
      },
    }));

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          source={{ uri }}
          style={style as any}
          resizeMode={resizeMode}
        />
      </View>
    );
  },
);

export default CustomImageZoom;
