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
import {
  JitsiSlice,
  TracksSlice,
  UserSlice,
  FishbowlSlice,
  createJitsiSlice,
  createTracksSlice,
  createUserSlice,
  createFishbowlSlice
} from '@/store';

export type JitsiStore = JitsiSlice & TracksSlice & UserSlice & FishbowlSlice;

export const useJitsiStore = create<JitsiStore>()(
  devtools(
    (...a) => ({
      ...createJitsiSlice(...a),
      ...createTracksSlice(...a),
      ...createUserSlice(...a),
      ...createFishbowlSlice(...a)
    }),
    {
      name: 'Jitsi',
      enabled: process.env.NODE_ENV === 'development',
      features: {
        pause: false,
        jump: false
      }
    }
  )
);
