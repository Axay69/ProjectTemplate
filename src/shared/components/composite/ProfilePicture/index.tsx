import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  ClipPath,
  Image as SvgImage,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

interface ProfilePictureProps {
  imageUri: string;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUri,
  size = width * 0.3,
  borderWidth = 4,
  borderColor = '#4CAF50',
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg height={size} width={size} style={styles.svg}>
        <Defs>
          <ClipPath id="clip">
            <Circle cx={size / 2} cy={size / 2} r={size / 2 - borderWidth} />
          </ClipPath>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - borderWidth / 2}
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
        <SvgImage
          x={borderWidth}
          y={borderWidth}
          width={size - borderWidth * 2}
          height={size - borderWidth * 2}
          href={{ uri: `file://${imageUri}` }}
          clipPath="url(#clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  svg: {
    alignSelf: 'center',
  },
});

export default ProfilePicture;
