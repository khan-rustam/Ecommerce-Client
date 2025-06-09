import { ReactNode } from 'react';

interface ToastOptions {
  duration?: number;
  position?: string;
  icon?: string;
  style?: Record<string, any>;
  [key: string]: any;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'loading' | 'warning' | 'info', message: string, options?: ToastOptions) => void;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

declare module './ToastContext' {
  export const ToastProvider: React.FC<{ children: ReactNode }>;
  export const useToast: () => ToastContextType;
  export default React.Context<ToastContextType>;
} 