import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Portal } from '@gorhom/portal';
import { styles } from './styles';
import FastImage from 'react-native-fast-image';
import { infoIcon as updateIcon } from '@assets/icons';
import { strings } from '@constants';

interface UpdateModalProps {
  isVisible: boolean;
  isForceUpdate: boolean;
  onLaterPress?: () => void;
  onUpdatePress: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isVisible,
  isForceUpdate,
  onLaterPress,
  onUpdatePress,
}) => {
  return (
    <Portal>
      <Modal
        isVisible={isVisible}
        backdropOpacity={0}
        animationIn="zoomIn"
        animationOut="zoomOut"
        useNativeDriver
        hideModalContentWhileAnimating
        statusBarTranslucent
        style={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <FastImage source={updateIcon as any} style={styles.iconCircle} />
          </View>

          <Text style={styles.title}>
            {isForceUpdate ? strings.updateRequired : strings.updateAvailable}
          </Text>

          <Text style={styles.message}>
            {isForceUpdate
              ? strings.updateRequiredDesc
              : strings.updateAvailableDesc}
          </Text>

          <View style={[styles.buttonContainer, { flexDirection: 'row' }]}>
            {!isForceUpdate && (
              <TouchableOpacity
                style={[styles.baseButton, styles.laterButton]}
                onPress={onLaterPress}
              >
                <Text style={styles.laterText}>{strings.later}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.baseButton,
                styles.updateButton,
                isForceUpdate && styles.fullWidthButton,
              ]}
              onPress={onUpdatePress}
            >
              <Text style={styles.updateText}>
                {isForceUpdate ? strings.updateNow : strings.update}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default UpdateModal;
