import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Toast } from '@/components/Toast';

type ToastVariant = 'default' | 'success' | 'error';

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [variant, setVariant] = useState<ToastVariant>('default');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, v: ToastVariant = 'default') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(null);
    setTimeout(() => {
      setVariant(v);
      setMessage(msg);
      timerRef.current = setTimeout(() => setMessage(null), 2500);
    }, 50);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} variant={variant} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
