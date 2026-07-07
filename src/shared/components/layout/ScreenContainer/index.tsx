import { KeyboardAvoidingView, View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ScreenProps } from './types';

const ScreenContainer: React.FC<ScreenProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <SafeAreaView edges={['top']} />

      <KeyboardProvider>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer}>
          <View style={styles.contentContainerStyle}>{children}</View>
        </KeyboardAvoidingView>
      </KeyboardProvider>
    </View>
  );
};

export default ScreenContainer;
