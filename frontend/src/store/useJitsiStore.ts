/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { create, StateCreator } from 'zustand';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';
import JitsiConnection from 'lib-jitsi-meet/types/hand-crafted/JitsiConnection';
import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';
import JitsiLocalTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiLocalTrack';

interface JitsiSlice {
  connection: JitsiConnection | undefined;
  conference: JitsiConference | undefined;
  roomName: string | undefined;
  setConnection: (connection: JitsiConnection) => void;
  setConference: (conference: JitsiConference) => void;
  setRoomName: (roomName: string) => void;
}

interface TracksSlice {
  tracks: JitsiTrack[][];
  shareTrack: JitsiLocalTrack | undefined;
  getTracksByUser: (id: string) => JitsiTrack[] | undefined;
  addUserTrack: (id: string, track: JitsiTrack) => void;
  removeUserTrack: (id: string, track: JitsiTrack) => void;
  assignShareTrack: (track: JitsiLocalTrack) => void;
  clearShareTrack: () => void;
}

interface UserSlice {
  userName: string | undefined;
  isModerator: boolean;
  isJoined: boolean;
  twitter: string | false;
  linkedin: string | false;
  changeUserName: (userName: string) => void;
  makeModerator: () => void;
  join: () => void;
  leave: () => void;
  setTwitter: (twitter: string) => void;
  setLinkedin: (linkedin: string) => void;
}

interface FishbowlSlice {
  seats: Array<string | undefined>;
  createSeats: (number: number) => Array<string | undefined>;
}

type ConsolidatedSlice = JitsiSlice & TracksSlice & UserSlice & FishbowlSlice;

const createJitsiSlice: StateCreator<ConsolidatedSlice, [], [], JitsiSlice> = set => ({
  connection: undefined,
  conference: undefined,
  roomName: undefined,
  setConnection: (connection: JitsiConnection) => set({ connection }),
  setConference: (conference: JitsiConference) => set({ conference }),
  setRoomName: (roomName: string) => set({ roomName })
});

const createTracksSlice: StateCreator<ConsolidatedSlice, [], [], TracksSlice> = (set, get) => ({
  tracks: [],
  shareTrack: undefined,
  getTracksByUser: (id: string) => get().tracks[id],
  addUserTrack: (id: string, track: JitsiTrack) => {
    set(state => {
      const tracks = state.tracks[id] || [];

      return { tracks: { ...state.tracks, [id]: [...tracks, track] } };
    });
  },
  removeUserTrack: (id: string, track: JitsiTrack) => {
    set(state => {
      const tracks = state.tracks[id] || [];

      return { tracks: { ...state.tracks, [id]: tracks.filter(t => t !== track) } };
    });
  },
  assignShareTrack: (track: JitsiLocalTrack) => set({ shareTrack: track }),
  clearShareTrack: () => set({ shareTrack: undefined })
});

const createUserSlice: StateCreator<ConsolidatedSlice, [], [], UserSlice> = set => ({
  userName: undefined,
  isModerator: false,
  isJoined: false,
  twitter: false,
  linkedin: false,
  changeUserName: (userName: string) => set({ userName }),
  makeModerator: () => set({ isModerator: true }),
  join: () => set({ isJoined: true }),
  leave: () => set({ isJoined: false }),
  setTwitter: (twitter: string) => set({ twitter }),
  setLinkedin: (linkedin: string) => set({ linkedin })
});

const createFishbowlSlice: StateCreator<ConsolidatedSlice, [], [], FishbowlSlice> = (set, get) => ({
  seats: [],
  createSeats: (number: number) => {
    set({ seats: Array.from({ length: number }) });

    return get().seats;
  }
});

export const useJitsiStore = create<ConsolidatedSlice>((...a) => ({
  ...createJitsiSlice(...a),
  ...createTracksSlice(...a),
  ...createUserSlice(...a),
  ...createFishbowlSlice(...a)
}));
