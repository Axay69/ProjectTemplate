import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export interface BarsiqAiModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const BarsiqAiModal: React.FC<BarsiqAiModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>Barsiq AI Modal Placeholder</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BarsiqAiModal;
