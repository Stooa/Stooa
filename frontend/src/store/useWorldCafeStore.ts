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
import { WorldCafe } from '@/types/api-platform';

export interface WorldCafeState {
  status: WorldCafeStatus | undefined;
  worldCafe: WorldCafe | undefined;
  isPrejoin: boolean;
  isReady: boolean;
  isGuest: boolean;
  isModerator: boolean;
  worldCafeParticipants: string[];
  startWorldCafe: (status: WorldCafeStatus) => void;
  setWorldCafeReady: (isReady: boolean) => void;
  setStatus: (status: WorldCafeStatus) => void;
  setWorldCafe: (data: WorldCafe) => void;
  setIsGuest: (isGuest: boolean) => void;
  setIsPrejoin: (isPrejoin: boolean) => void;
  setIsModerator: (isModerator: boolean) => void;
  addWorldCafeParticipant: (participant: string) => void;
  removeWorldCafeParticipant: (participant: string) => void;
}

export const useWorldCafeStore = create<WorldCafeState>()(
  devtools(
    (set, get) => ({
      status: undefined,
      isPrejoin: true,
      isReady: false,
      isGuest: false,
      worldCafe: undefined,
      isModerator: false,
      worldCafeParticipants: [],
      startWorldCafe: (status: WorldCafeStatus) => {
        set({ status }, false, { type: 'startWorldCafe' });
      },
      setWorldCafeReady: (isReady: boolean) => {
        if (get().isReady !== isReady) {
          set({ isReady }, false, { type: 'setWorldCafeReady' });
        }
      },
      setStatus: (status: WorldCafeStatus) => {
        if (get().status !== status) {
          set({ status }, false, { type: 'setStatus' });
        }
      },
      setWorldCafe: (worldCafe: WorldCafe) => {
        set({ worldCafe }, false, { type: 'setWorldCafe' });
      },
      setIsGuest: (isGuest: boolean) => {
        set({ isGuest }, false, { type: 'setIsGuest' });
      },
      setIsPrejoin: (isPrejoin: boolean) => {
        set({ isPrejoin }, false, { type: 'setIsPrejoin' });
      },
      setIsModerator: (isModerator: boolean) => {
        if (get().isModerator !== isModerator) {
          set({ isModerator }, false, { type: 'setIsModerator' });
        }
      },
      addWorldCafeParticipant: participant => {
        const findParticipant = get().worldCafeParticipants.findIndex(
          arrParticipant => arrParticipant === participant
        );

        if (findParticipant === -1) {
          const currentParticipants = get().worldCafeParticipants;
          set({ worldCafeParticipants: [...currentParticipants, participant] }, false, {
            type: 'setParticipant'
          });
        }
      },
      removeWorldCafeParticipant: participant => {
        const participantsWithoutRemoved = get().worldCafeParticipants.filter(
          arrParticipant => arrParticipant !== participant
        );

        set({ worldCafeParticipants: participantsWithoutRemoved }, false, {
          type: 'setParticipant'
        });
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
