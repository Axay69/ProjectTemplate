import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, fonts, textVariants, TextVariant } from '@theme/index';

interface MyTextProps extends TextProps {
  variant?: TextVariant;
  color?: keyof typeof colors;
  fontFamily?: keyof typeof fonts;
}

export const MyText: React.FC<MyTextProps> = ({
  style,
  variant = 'font_16',
  color = 'BLACK',
  fontFamily = 'Regular',
  allowFontScaling = false,
  ...props
}) => {
  const textStyle = [
    styles.base,
    textVariants[variant],
    { color: colors[color] },
    { fontFamily: fonts[fontFamily] },
    style,
  ];

  return (
    <RNText allowFontScaling={allowFontScaling} style={textStyle} {...props} />
  );
};

const styles = StyleSheet.create({
  base: {
    // default styles if needed
  },
});
