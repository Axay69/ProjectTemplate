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
  toastIcon: ImageSourcePropType;
  text1: string | undefined;
  onPress?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  toastBg,
  toastIcon,
  text1,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      <View
        style={[
          styles.container,
          {
            borderColor: toastBg,
          },
        ]}
      >
        <View>
          <Image
            source={toastIcon}
            resizeMode="contain"
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{text1}</Text>
          <View style={{ height: 2 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomToast;
