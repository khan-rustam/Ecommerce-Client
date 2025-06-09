import React, { createContext, useContext, ReactNode } from 'react';
import toast, { ToastPosition } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  icon?: string;
  style?: Record<string, any>;
  [key: string]: any;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'loading' | 'warning' | 'info' | string, message: string, options?: ToastOptions) => void;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider component that provides toast functionality
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  /**
   * Show a toast notification
   */
  const showToast = (type: string, message: string, options: ToastOptions = {}) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'loading':
        return toast.loading(message, options);
      case 'warning':
        toast(message, {
          ...options,
          icon: '⚠️',
          style: {
            backgroundColor: '#FEF3C7',
            color: '#92400E',
          },
        });
        break;
      case 'info':
        toast(message, {
          ...options,
          icon: 'ℹ️',
          style: {
            backgroundColor: '#E0F2FE',
            color: '#075985',
          },
        });
        break;
      default:
        toast(message, options);
    }
  };

  // Dismiss a specific toast
  const dismissToast = (id: string) => {
    toast.dismiss(id);
  };

  // Dismiss all toasts
  const dismissAllToasts = () => {
    toast.dismiss();
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, dismissAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast functionality
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext; 