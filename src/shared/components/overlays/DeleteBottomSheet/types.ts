export interface CustomBottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  snapPoints?: (string | number)[];
  isForceClose?: boolean;
  initialIndex?: number;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  title?: string;
  message?: string;
  description?: string;
  closeTriggersConfirm?: boolean;
}
