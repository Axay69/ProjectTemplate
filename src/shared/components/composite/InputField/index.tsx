import React, { forwardRef, useState } from 'react';
import {
  Image,
  NativeSyntheticEvent,
  TargetedEvent,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '@theme';
import { styles } from './styles';
import { eyeIcon, eyeSlashIcon } from '@assets/icons';
import { InputFieldProps } from './types';
import { scale } from 'react-native-size-matters';

const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      label,
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
      leftIconTintColor,
      leftIconStyle,
      onSubmitEditing,
      rightText,
      rightTextStyle,
      onFocus: propsOnFocus,
      onBlur: propsOnBlur,
      InputComponent = TextInput,
      rightLabel,
      rightIcon,
      rightIconStyle,
      onRightIconPress,
      userNameDesc,
      onPress,
      leftComponent,
      rightComponent,
      topComponent,
      isMentionHighlighting = false,
      children,
      noDynamicPlaceholderFonts = false,
      ...other
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const onFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
      setIsFocused(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propsOnFocus?.(e as any);
    };

    const onBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
      setIsFocused(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propsOnBlur?.(e as any);
    };

    const handleTextChange = (text: string) => {
      if (text.startsWith(' ')) {
        text = text.trimStart();
      }
      onChangeText?.(text);
    };

    const toggleSecureText = React.useCallback(() => {
      if (setSecureText) {
        setSecureText(!secureText);
      }
    }, [setSecureText, secureText]);

    return (
      <View style={[styles.mainContainer, parentStyle]}>
        {(label || rightLabel) && (
          <View style={styles.labelContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            {rightLabel && <Text style={styles.rightLabel}>{rightLabel}</Text>}
          </View>
        )}
        <TouchableOpacity
          activeOpacity={onPress ? 1 : 1}
          onPress={onPress}
          disabled={!onPress}
          style={[
            styles.containerStyle,
            containerStyle,
            isFocused && styles.containerFocused,
            errorMsg ? styles.containerError : undefined,
            {
              shadowColor: isFocused ? colors.inputFocusShadow : 'transparent',
            },
            topComponent
              ? {
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  paddingHorizontal: 0,
                  paddingVertical: scale(6),
                }
              : undefined,
          ]}
        >
          {topComponent}
          <View
            style={
              topComponent
                ? {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: scale(8),
                  }
                : {
                    flexDirection: 'row',
                    alignItems: other.multiline ? 'flex-start' : 'center',
                    flex: 1,
                  }
            }
          >
            {leftComponent}
            {leftIcon && (
              <Image
                source={leftIcon}
                style={[styles.leftIcon, leftIconStyle]}
                resizeMode="contain"
                tintColor={
                  leftIconTintColor
                    ? leftIconTintColor === 'null'
                      ? undefined
                      : leftIconTintColor
                    : colors.inputIconColor
                }
              />
            )}

            <InputComponent
              {...((InputComponent as React.ComponentType) === TextInput
                ? { ref }
                : {})}
              style={[
                styles.textInput,
                textInputStyle,
                noDynamicPlaceholderFonts
                  ? { fontFamily: fonts.Medium }
                  : (value?.length ?? 0) > 0
                  ? { fontFamily: fonts.Medium }
                  : { fontFamily: fonts.Regular },
              ]}
              value={isMentionHighlighting ? undefined : value}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              placeholderTextColor={colors.inputPlaceholderColor}
              secureTextEntry={secureText}
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              cursorColor={colors.inputPlaceholderColor}
              onSubmitEditing={onSubmitEditing}
              onFocus={onFocus}
              onBlur={onBlur}
              {...other}
            >
              {isMentionHighlighting ? children : undefined}
            </InputComponent>
            {rightComponent}
            {rightText && (
              <Text style={[styles.rightText, rightTextStyle]}>
                {rightText}
              </Text>
            )}
            {rightIcon && (
              <TouchableOpacity
                onPress={onRightIconPress}
                disabled={!onRightIconPress}
                style={styles.rightIconContainer}
              >
                <Image
                  source={rightIcon}
                  style={[styles.rightIcon, rightIconStyle]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {secureTextOption && setSecureText && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleSecureText}
              >
                <Image
                  source={secureText ? eyeSlashIcon : eyeIcon}
                  style={styles.secureIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        {userNameDesc && (
          <Text style={styles.userNameDescStyle}>{userNameDesc}</Text>
        )}
        {errorMsg && <Text style={[styles.errorStyle]}>{errorMsg}</Text>}
      </View>
    );
  },
);

export default InputField;
