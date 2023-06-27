/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { WorldCafeStatus } from '@/jitsi/Status';

export interface WorldCafeState {
  status: WorldCafeStatus;
  isPrejoin: string;
  startWorldCafe: (status: WorldCafeStatus) => void;
}

export const useWorldCafeStore = create<WorldCafeState>()(
  devtools(
    set => ({
      status: WorldCafeStatus.NOT_STARTED,
      isPrejoin: 'true',
      startWorldCafe: (status: WorldCafeStatus) => {
        set({ status }, false, { type: 'startWorldCafe' });
      }
    }),
    {
      name: 'WorldCafe',
      enabled: process.env.NODE_ENV === 'development',
      features: {
        pause: false,
        jump: false
      }
    }
  )
);
