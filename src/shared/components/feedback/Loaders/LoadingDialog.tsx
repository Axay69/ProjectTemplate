import React, { JSX } from 'react';
import { NativeLoader } from './NativeLoader';

// Define the props type for the LoadingDialog component
interface LoadingDialogProps {
  isVisible: boolean; // Prop to control visibility of the loader
  title?: string; // Optional title for the loader
}

export default function LoadingDialog({
  isVisible,
  title,
}: LoadingDialogProps): JSX.Element {
  return <NativeLoader visible={isVisible} title={title} />;
}
