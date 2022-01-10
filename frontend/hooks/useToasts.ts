/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

import { Toast, ToastContent } from '@/types/toasts';

let toastCount = 0;
let toastsList = [];
let delayedToasts = {};

const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeById = (id: number) => {
    const newToasts = toastsList.filter(t => t.id !== id);
    toastsList = newToasts;
    setToasts(toastsList);
  };

  const clearDelayed = (type: string) => {
    const toast = delayedToasts[type];
    if (toast) {
      delete delayedToasts[type];
    }
  };

  const callDelayedToasts = (type: string) => {
    const toast = delayedToasts[type];
    if (toast) {
      toastsList = [...toastsList, toast];
      setToasts(toastsList);
      clearDelayed(toast.type);
    }
  };

  const addToast = (content: ToastContent, delay = 0, autoclose = 0) => {
    const id = toastCount++;
    const toast = { ...content, id };
    const toastExists = toastsList.filter(t => t.type === toast.type);

    if (toastExists.length) return;

    if (delay) {
      delayedToasts = { ...delayedToasts, [toast.type]: toast };

      console.log('Delayed', delayedToasts);

      setTimeout(() => {
        console.log('Calling delayed', toast.type);
        callDelayedToasts(toast.type);
      }, delay);
    } else {
      toastsList = [...toastsList, toast];
      console.log('List', toastsList);
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

  useEffect(() => {
    console.log('Toast set', toasts);
  }, [toasts]);

  return { toasts, addToast, onDismiss, clearDelayed };
};

export default useToasts;
