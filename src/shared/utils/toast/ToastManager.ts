import Toast from 'react-native-toast-message';

export class ToastManager {
  /**
   * Show success toast
   */
  static showSuccess(message: string, duration: number = 3000): void {
    Toast.hide();
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
      swipeable: false,
      visibilityTime: duration,
    });
  }

  /**
   * Show error toast
   */
  static showError(message: string): void {
    Toast.hide();
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom',
      swipeable: false,
      visibilityTime: 4000,
    });
  }

  /**
   * Show info toast
   */
  static showInfo(message: string, duration: number = 3000): void {
    Toast.hide();
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      swipeable: false,
      visibilityTime: duration,
    });
  }

  /**
   * Show warning toast
   */
  static showWarning(message: string): void {
    Toast.hide();
    Toast.show({
      type: 'warning',
      text1: message,
      position: 'bottom',
      swipeable: false,
      visibilityTime: 3500,
    });
  }

  /**
   * Hide all toasts
   */
  static hide(): void {
    Toast.hide();
  }

  /**
   * Show custom toast with options
   */
  static showCustom(options: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onPress?: () => void;
  }): void {
    Toast.hide();
    Toast.show({
      type: options.type,
      text1: options.message,
      position: 'bottom',
      swipeable: false,
      visibilityTime: options.duration || 3000,
    });
  }
}
