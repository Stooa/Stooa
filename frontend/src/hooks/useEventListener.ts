/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useEffect } from 'react';

type useEventListenerHandler = (
  eventName: string,
  handler: (event: CustomEvent) => void | Promise<void>,
  element?: Element | typeof global,
  options?: AddEventListenerOptions
) => void;

const useEventListener: useEventListenerHandler = (
  eventName,
  handler,
  element = global,
  options = {}
) => {
  const savedHandler = useRef<(event: CustomEvent) => void | Promise<void>>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) =>
      savedHandler.current && event instanceof CustomEvent && savedHandler.current(event);

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
};

export default useEventListener;
