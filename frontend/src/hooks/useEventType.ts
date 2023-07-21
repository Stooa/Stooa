/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EventType, FISHBOWL, WORLD_CAFE } from '@/types/event-types';
import { useRouter } from 'next/router';

export const useEventType = (): { eventType: EventType } => {
  const { pathname } = useRouter();
  let eventType;

  if (pathname.includes(WORLD_CAFE)) {
    eventType = WORLD_CAFE;
  } else {
    eventType = FISHBOWL;
  }

  return { eventType };
};
