import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

interface KeyboardSpacerProps {
  /**
   * Additional offset to add to the spacer height
   */
  bottomOffset?: number;
}

const KeyboardSpacer: React.FC<KeyboardSpacerProps> = ({
  bottomOffset = 0,
}) => {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight, progress } = useReanimatedKeyboardAnimation();

  const spacerStyle = useAnimatedStyle(() => {
    const kbHeight = Math.abs(keyboardHeight.value);
    const bottomInset = insets.bottom;
    const finalHeight = kbHeight - bottomInset * progress.value + bottomOffset;
    return {
      height: finalHeight > 0 ? finalHeight : 0,
    };
  });

  return <Reanimated.View style={[spacerStyle]} />;
};

export default KeyboardSpacer;
