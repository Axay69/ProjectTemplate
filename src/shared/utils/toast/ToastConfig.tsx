import { ToastConfig as RNToastConfig } from 'react-native-toast-message/lib/src/types/index';
import {
  errorIcon,
  infoIcon,
  successIcon,
  warningIcon,
} from '@shared/assets/icons';
import { colors } from '@theme/colors';
import { CustomToast } from '@shared/components';
import { ToastConfigProps } from './types';

export const toastConfig: RNToastConfig = {
  error: ({ text1 }: ToastConfigProps) => (
    <CustomToast
      toastBg={colors.errorColor}
      toastBorderColor={colors.errorColor}
      toastIcon={errorIcon}
      text1={text1}
    />
  ),
  info: ({ text1 }: ToastConfigProps) => (
    <CustomToast
      toastBg={colors.infoColor}
      toastBorderColor={colors.infoColor}
      toastIcon={infoIcon}
      text1={text1}
    />
  ),
  success: ({ text1 }: ToastConfigProps) => (
    <CustomToast
      toastBg={colors.successColor}
      toastBorderColor={colors.successColor}
      toastIcon={successIcon}
      text1={text1}
    />
  ),
  warning: ({ text1 }: ToastConfigProps) => (
    <CustomToast
      toastBg={colors.warningColor}
      toastBorderColor={colors.warningColor}
      toastIcon={warningIcon}
      text1={text1}
    />
  ),
};
