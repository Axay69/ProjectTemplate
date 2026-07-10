import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface S3ImageSkeletonProps {
  style?: import('react-native').StyleProp<ViewStyle>;
}

export const S3ImageSkeleton = React.memo(({ style }: S3ImageSkeletonProps) => {
  const flattenedStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        style,
        {
          width: flattenedStyle.width || '100%',
          height: flattenedStyle.height || '100%',
          aspectRatio: flattenedStyle.aspectRatio,
          borderRadius: flattenedStyle.borderRadius || 0,
          backgroundColor: '#E2E8F0',
          opacity,
        },
      ]}
    />
  );
});
