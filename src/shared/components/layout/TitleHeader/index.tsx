import { Image, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { TitleHeaderProps } from './types';
import { colors } from '@theme';

const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  containerStyle,
  textStyle,
  leftIcon,
  leftIconStyle,
  onPressLeft,
  rightIcon,
  rightIconStyle,
  onPressRight,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={onPressLeft}
        activeOpacity={0.8}
        style={styles.leftWrap}
      >
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.leftIcon, leftIconStyle]}
            resizeMode="contain"
            tintColor={colors.BLACK}
          />
        )}
      </TouchableOpacity>
      <View style={styles.titleWrap}>
        <Text style={[styles.titleTxt, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPressRight}
        activeOpacity={0.8}
        style={styles.rightWrap}
      >
        {rightIcon && (
          <Image
            source={rightIcon}
            style={[styles.rightIcon, rightIconStyle]}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TitleHeader;
