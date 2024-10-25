/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';
import { DevtoolsStateCreator, JitsiStore } from '@/store';

export interface TracksSlice {
  tracks: JitsiTrack[][];
  localTracksCreated: boolean;
  getTracksByUser: (id: string) => JitsiTrack[] | undefined;
  addUserTrack: (id: string, track: JitsiTrack) => void;
  removeUserTrack: (id: string, track: JitsiTrack) => void;
  localTracksCreatedEvent: () => void;
  localTracksRemovedEvent: () => void;
}

export const createTracksSlice: DevtoolsStateCreator<JitsiStore, TracksSlice> = (set, get) => ({
  tracks: [],
  localTracksCreated: false,
  getTracksByUser: (id: string) => get().tracks[id],
  addUserTrack: (id: string, track: JitsiTrack) =>
    set(
      state => {
        const tracks = state.tracks[id] || [];

        return { tracks: { ...state.tracks, [id]: [...tracks, track] } };
      },
      false,
      { type: 'addUserTrack', context: { id, track } }
    ),
  removeUserTrack: (id: string, track: JitsiTrack) =>
    set(
      state => {
        const tracks = state.tracks[id] || [];

        return { tracks: { ...state.tracks, [id]: tracks.filter(t => t !== track) } };
      },
      false,
      { type: 'removeUserTrack', context: { id, track } }
    ),
  localTracksCreatedEvent: () =>
    set({ localTracksCreated: true }, false, { type: 'localTracksCreated' }),
  localTracksRemovedEvent: () =>
    set({ localTracksCreated: false }, false, { type: 'localTracksRemoved' })
});
