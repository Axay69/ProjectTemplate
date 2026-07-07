import React, { forwardRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '@theme';
import { styles } from './styles';
import { eyeIcon, eyeSlashIcon } from '@assets/icons';
import { InputFieldProps } from './types';

const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      secureText = false,
      secureTextOption = false,
      setSecureText,
      containerStyle,
      textInputStyle,
      parentStyle,
      errorMsg,
      leftIcon,
      leftIconStyle,
      onSubmitEditing,
      rightText,
      rightTextStyle,
      ...other
    },
    ref,
  ) => {
    const [borderColor, setBorderColor] = useState('transparent');

    const onFocus = () => {
      setBorderColor(colors.BLACK);
    };
    const onBlur = () => {
      setBorderColor('transparent');
    };
    return (
      <View style={[styles.mainContainer, parentStyle]}>
        <View
          style={[
            styles.containerStyle,
            {
              borderColor: errorMsg ? colors.errorColor : borderColor,
            },
            containerStyle,
          ]}
        >
          {leftIcon && (
            <Image
              source={leftIcon}
              style={[styles.leftIcon, leftIconStyle]}
              resizeMode="contain"
            />
          )}

          <TextInput
            ref={ref}
            style={[styles.textInput, textInputStyle]}
            value={value}
            onChangeText={text => {
              if (text.startsWith(' ')) {
                text = text.trimStart();
              }
              onChangeText?.(text);
            }}
            placeholder={placeholder}
            placeholderTextColor={colors.black40}
            secureTextEntry={secureText}
            cursorColor={colors.black40}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
            onBlur={onBlur}
            {...other}
          />
          {rightText && (
            <Text style={[styles.rightText, rightTextStyle]}>{rightText}</Text>
          )}
          {secureTextOption && setSecureText && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setSecureText(!secureText)}
            >
              <Image
                source={secureText ? eyeSlashIcon : eyeIcon}
                style={styles.secureIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        {errorMsg && <Text style={[styles.errorStyle]}>{errorMsg}</Text>}
      </View>
    );
  },
);

export default InputField;
