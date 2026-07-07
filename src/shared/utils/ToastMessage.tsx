import { ToastManager } from './toast/ToastManager';

/**
 * @deprecated Use ToastManager.showSuccess() instead
 */
export const SuccessDialog = async (
  title?: string,
  duration: number = 3000,
): Promise<void> => {
  return ToastManager.showSuccess(title || '', duration);
};

/**
 * @deprecated Use ToastManager.showError() instead
 */
export const ErrorDialog = async (title?: string): Promise<void> => {
  return ToastManager.showError(title || '');
};

/**
 * @deprecated Use ToastManager.showInfo() instead
 */
export const InfoDialog = async (title?: string): Promise<void> => {
  return ToastManager.showInfo(title || '');
};

/**
 * @deprecated Use ToastManager.showWarning() instead
 */
export const WarningDialog = async (title: string): Promise<void> => {
  return ToastManager.showWarning(title);
};
