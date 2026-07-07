import React, { useCallback, useRef, useEffect, ReactNode } from 'react';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@theme';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomBottomSheetProps {
  visible: boolean; // controls open/close
  onClose?: () => void; // callback when closed
  children: ReactNode; // content inside sheet
  snapPoints?: (string | number)[]; // size(s) of bottom sheet
  isForceClose?: boolean; // show or hide backdrop
  initialIndex?: number; // initial sheet index (-1 = closed)
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoints, // default half screen ["%20", "%40"]
  isForceClose = false,
  initialIndex = -1,
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
      enableDynamicSizing={true}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        bounces={false}
      >
        <SafeAreaView edges={['bottom']}>{children}</SafeAreaView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
