export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
}

export interface ToastConfigProps {
  text1?: string;
  onPress?: () => void;
}
