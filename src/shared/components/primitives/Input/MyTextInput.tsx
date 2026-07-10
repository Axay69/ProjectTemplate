import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radius, LAYOUT } from '@theme/index';

interface MyTextInputProps extends TextInputProps {
  containerStyle?: any;
}

export const MyTextInput: React.FC<MyTextInputProps> = ({
  style,
  containerStyle,
  placeholderTextColor = colors.textSecondary,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <RNTextInput
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    minHeight: LAYOUT.INPUT.MIN_HEIGHT,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: LAYOUT.INPUT.PADDING_HORIZONTAL,
    paddingVertical: LAYOUT.INPUT.PADDING_VERTICAL,
    color: colors.text,
    fontSize: 16,
  },
});
