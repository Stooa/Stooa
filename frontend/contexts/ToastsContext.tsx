/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext, useContext, useState } from 'react';

import { Toast, ToastContent } from '@/types/toasts';

interface ToastContext {
  toasts: Toast[];
  addToast: (toast: Toast, delay?: number, autoclose?: number) => void;
  onDismiss: (id: number) => void;
  clearDelayed: (type: string) => void;
}

const ToastsContext = createContext<ToastContext>({
  toasts: [],
  addToast: () => {
    console.log();
  },
  onDismiss: () => {
    console.log();
  },
  clearDelayed: () => {
    console.log();
  }
});

const ToastsProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  let toastCount = 0;
  let toastsList = [];
  let delayedToasts = {};

  const removeById = (id: number) => {
    const newToasts = toastsList.map((toast: Toast) =>
      toast.id === id ? { ...toast, dismissed: true } : toast
    );
    toastsList = newToasts;
    setToasts(toastsList);
  };

  const clearDelayed = (type: string) => {
    setToasts(toasts => toasts.map((t: Toast) => (t.type === type ? { ...t, shown: true } : t)));
    delete delayedToasts[type];
  };

  const callDelayedToasts = (type: string) => {
    const toast: Toast = delayedToasts[type];
    if (toast) {
      toastsList = [...toastsList, toast];
      setToasts(toastsList);
      clearDelayed(type);
    }
  };

  const addToast = (content: ToastContent, delay = 0, autoclose = 0) => {
    toastCount++;
    const id = toastCount;
    const toast: Toast = { ...content, id, dismissed: false, shown: false };
    const toastExists = toastsList.some((toast: Toast) => toast.type === content.type);

    if (toastExists) return;

    if (delay) {
      delayedToasts = { ...delayedToasts, [toast.type]: toast };

      setTimeout(() => {
        callDelayedToasts(toast.type);
      }, delay);
    } else {
      toastsList = [...toastsList, toast];
      setToasts(toastsList);
    }

    if (autoclose) {
      setTimeout(() => {
        removeById(id);
      }, autoclose + delay);
    }
  };

  // avoid creating a new fn on every render
  const onDismiss = (id: number) => removeById(id);

  return (
    <ToastsContext.Provider value={{ toasts, addToast, onDismiss, clearDelayed }}>
      {children}
    </ToastsContext.Provider>
  );
};

const useToasts = () => useContext(ToastsContext);

export { ToastsProvider, useToasts };
