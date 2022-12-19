/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

export const useNavigatorType = () => {
  const [deviceType, setDeviceType] = useState<'Mobile' | 'Desktop'>();

  useEffect(() => {
    let hasTouchScreen = false;
    const userNavigator = navigator as Navigator;

    if (userNavigator.maxTouchPoints) {
      hasTouchScreen = userNavigator.maxTouchPoints > 0;
    } else {
      const mQ = window && window.matchMedia('(pointer:coarse)');
      if (mQ && mQ.media === '(pointer:coarse)') {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        const UA = userNavigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    if (hasTouchScreen) {
      setDeviceType('Mobile');
    } else {
      setDeviceType('Desktop');
    }
  }, []);

  return { deviceType };
};
