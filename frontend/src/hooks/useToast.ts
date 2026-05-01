import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  duration?: number;
}

export const useToast = () => {
  const toast = {
    success: (message: string, options?: ToastOptions) => {
      return sonnerToast.success(message, {
        description: options?.description,
        action: options?.action ? {
          label: options.action.label,
          onClick: options.action.onClick,
        } : undefined,
        cancel: options?.cancel ? {
          label: options.cancel.label,
          onClick: options.cancel.onClick || (() => {}),
        } : undefined,
        duration: options?.duration,
      });
    },

    error: (message: string, options?: ToastOptions) => {
      return sonnerToast.error(message, {
        description: options?.description,
        action: options?.action ? {
          label: options.action.label,
          onClick: options.action.onClick,
        } : undefined,
        cancel: options?.cancel ? {
          label: options.cancel.label,
          onClick: options.cancel.onClick || (() => {}),
        } : undefined,
        duration: options?.duration,
      });
    },

    warning: (message: string, options?: ToastOptions) => {
      return sonnerToast.warning(message, {
        description: options?.description,
        action: options?.action ? {
          label: options.action.label,
          onClick: options.action.onClick,
        } : undefined,
        cancel: options?.cancel ? {
          label: options.cancel.label,
          onClick: options.cancel.onClick || (() => {}),
        } : undefined,
        duration: options?.duration,
      });
    },

    info: (message: string, options?: ToastOptions) => {
      return sonnerToast.info(message, {
        description: options?.description,
        action: options?.action ? {
          label: options.action.label,
          onClick: options.action.onClick,
        } : undefined,
        cancel: options?.cancel ? {
          label: options.cancel.label,
          onClick: options.cancel.onClick || (() => {}),
        } : undefined,
        duration: options?.duration,
      });
    },

    default: (message: string, options?: ToastOptions) => {
      return sonnerToast(message, {
        description: options?.description,
        action: options?.action ? {
          label: options.action.label,
          onClick: options.action.onClick,
        } : undefined,
        cancel: options?.cancel ? {
          label: options.cancel.label,
          onClick: options.cancel.onClick || (() => {}),
        } : undefined,
        duration: options?.duration,
      });
    },

    promise: <T,>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => {
      return sonnerToast.promise(promise, {
        loading,
        success,
        error,
      });
    },
  };

  return toast;
};
