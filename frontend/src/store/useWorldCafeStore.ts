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
import { WorldCafe } from '@/types/api-platform/interfaces/worldcafe';

export interface WorldCafeState {
  status: WorldCafeStatus;
  worldCafe: WorldCafe | undefined;
  isPrejoin: boolean;
  isReady: boolean;
  startWorldCafe: (status: WorldCafeStatus) => void;
  setWorldCafe: (data: WorldCafe) => void;
}

export const useWorldCafeStore = create<WorldCafeState>()(
  devtools(
    set => ({
      status: WorldCafeStatus.NOT_STARTED,
      isPrejoin: true,
      isReady: false,
      worldCafe: undefined,
      startWorldCafe: (status: WorldCafeStatus) => {
        set({ status }, false, { type: 'startWorldCafe' });
      },
      setWorldCafe: (worldCafe: WorldCafe) => {
        set({ worldCafe }, false, { type: 'setWorldCafe' });
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
