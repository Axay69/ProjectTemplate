import React, { useCallback, useRef, useEffect } from 'react';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import { CustomBottomSheetProps } from './types';
import SpacerView from '../../layout/Spacer';

const LogoutBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  onClose,
  snapPoints = ['40%'],
  isForceClose = false,
  initialIndex = -1,
  cancelText,
  onConfirm,
  confirmText,
  message,
  title,
  description,
}) => {
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={isForceClose ? 'collapse' : 'close'}
        opacity={0.5}
        style={{ backgroundColor: colors.BLACK }}
      />
    ),
    [isForceClose],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1 && onClose) onClose();
    },
    [onClose],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={initialIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={isForceClose ? false : true}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.WHITE }}
      handleIndicatorStyle={{ backgroundColor: colors.lightGray }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        bounces={false}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <SpacerView height={10} />
            <Text style={styles.message}>{message}</Text>
            <SpacerView height={7} />
            <Text style={styles.description}>{description}</Text>
            <SpacerView height={10} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttonView, { marginRight: 5 }]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonView,
                  { marginLeft: 5, backgroundColor: colors.black20 },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: colors.BLACK }]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
            <SpacerView height={20} />
          </View>
        </SafeAreaView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default LogoutBottomSheet;
