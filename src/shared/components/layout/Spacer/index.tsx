import { View } from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';

interface SpacerProps {
  height?: number;
  width?: number;
}

const SpacerView: React.FC<SpacerProps> = ({ height = 0, width }) => {
  return <View style={{ height: scale(height), width }} />; // shorthand here
};

export default SpacerView;
