import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import { styles } from './styles';
import { scale } from 'react-native-size-matters';
import { colors } from '@theme';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('screen');

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  icon?: ImageSourcePropType;
  iconBgColor?: string;
  iconTintColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  icon,
  iconTintColor,
}) => {
  if (!isVisible) return null;
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modal}
      useNativeDriver
      hideModalContentWhileAnimating
      statusBarTranslucent
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={styles.container}>
        {icon && (
          <Image
            source={icon}
            resizeMode="contain"
            style={[
              styles.icon,
              iconTintColor ? { tintColor: iconTintColor } : undefined,
            ]}
          />
        )}

        <Text style={[styles.title, !icon && { marginTop: 0 }]}>{title}</Text>
        <Text style={[styles.message, { paddingHorizontal: scale(15) }]}>
          {message}
        </Text>

        <View
          style={[
            styles.buttonContainer,
            { flexDirection: 'row', paddingHorizontal: scale(20) },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>

          <View style={styles.confirmButtonOuter}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
