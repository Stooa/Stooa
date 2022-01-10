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
  const [toastCount, setToastCount] = useState(0);
  const [toastsList, setToastsList] = useState([]);
  const [delayedToasts, setDelayedToasts] = useState({});

  const removeById = (id: number) => {
    const newToasts = toastsList.filter(t => t.id !== id);
    setToastsList(newToasts);
    setToasts(toastsList);
  };

  const clearDelayed = (type: string) => {
    const toast = delayedToasts[type];
    if (toast) {
      setDelayedToasts(delayedToasts => delete delayedToasts[type]);
    }
  };

  const callDelayedToasts = (type: string) => {
    const toast = delayedToasts[type];
    if (toast) {
      setToastsList([...toastsList, toast]);
      setToasts(toastsList);
      clearDelayed(toast.type);
    }
  };

  const addToast = (content: ToastContent, delay = 0, autoclose = 0) => {
    const id = toastCount + 1;
    const toast = { ...content, id };
    const toastExists = toastsList.filter(t => t.type === toast.type);

    if (toastExists.length) return;

    setToastCount(toastCount + 1);

    if (delay) {
      setDelayedToasts({ ...delayedToasts, [toast.type]: toast });

      setTimeout(() => {
        callDelayedToasts(toast.type);
      }, delay);
    } else {
      setToastsList([...toastsList, toast]);
      setToasts(toastsList);
    }

    if (autoclose) {
      setTimeout(() => {
        removeById(id);
      }, autoclose + delay);
    }
  };

  // avoid creating a new fn on every render
  const onDismiss = (id: number) => () => removeById(id);

  return (
    <ToastsContext.Provider value={{ toasts, addToast, onDismiss, clearDelayed }}>
      {children}
    </ToastsContext.Provider>
  );
};

const useToasts = () => {
  const context = useContext(ToastsContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

export { ToastsProvider, useToasts };
