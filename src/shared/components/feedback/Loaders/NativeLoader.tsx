import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '@theme/index';
import { screenHeight } from '@shared/constants/app';

// Define the types for the component props
interface NativeLoaderProps {
  title?: string; // Optional title for the loader
  visible: boolean; // Controls the visibility of the loader
  bgTransparency?: number; // Transparency level for the backdrop (default 0.5)
  aiSize?: 'small' | 'large' | number; // Size of the ActivityIndicator
  titleStyle?: TextStyle; // Optional custom style for the title text
  containerStyle?: ViewStyle; // Optional custom style for the container
}

export const NativeLoader: React.FC<NativeLoaderProps> = ({
  title,
  visible = false,
  bgTransparency = 0.5,
  aiSize = 'small',
  titleStyle,
  containerStyle,
}) => {
  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
      isVisible={visible}
      onBackButtonPress={() => {}}
      style={{ margin: 0 }}
      backdropOpacity={bgTransparency}
      deviceHeight={screenHeight}
      statusBarTranslucent
      coverScreen={false}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...containerStyle,
        }}
      >
        <View
          style={{
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={aiSize} color={colors.WHITE} />
          {title && (
            <Text
              style={{ paddingLeft: 8, color: colors.WHITE, ...titleStyle }}
            >
              {title}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};
