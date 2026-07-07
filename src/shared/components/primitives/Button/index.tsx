import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import { CTButtonProps } from './types';
import { colors } from '@theme';

const PrimaryButton: React.FC<CTButtonProps> = ({
  title,
  onPress,
  buttonContainerStyle,
  titleStyle,
  disabled = false,
  otherBGColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonContainerStyle,
        disabled && styles.disabledButton,
        {
          backgroundColor: otherBGColor ? otherBGColor : colors.BLACK,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
