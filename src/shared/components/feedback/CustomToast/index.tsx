import React from 'react';
import {
  Image,
  Text,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { styles } from './styles';

interface CustomToastProps {
  toastBg: string;
  toastBorderColor: string;
  toastIcon: ImageSourcePropType;
  text1: string | undefined;
  onPress?: () => void;
  onUndo?: () => void;
  undoText?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  toastBg,
  toastBorderColor,
  toastIcon,
  text1,
  onPress,
  onUndo,
  undoText = 'Undo',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.mainContainer}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: toastBg,
            borderLeftColor: toastBorderColor,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={toastIcon}
            resizeMode="contain"
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={styles.textStyle}
            numberOfLines={3}
            allowFontScaling={false}
          >
            {text1}
          </Text>
        </View>
        {onUndo && (
          <TouchableOpacity
            style={styles.undoContainer}
            onPress={onUndo}
            activeOpacity={0.7}
          >
            <Text style={styles.undoText}>{undoText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomToast;
