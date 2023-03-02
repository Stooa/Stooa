/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefObject, useEffect } from 'react';

export const useClickOutside = (ref: RefObject<HTMLDivElement>, handler: (event) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('pointerdown', listener, false);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('pointerdown', listener, false);
    };
  }, [ref, handler]);
};
