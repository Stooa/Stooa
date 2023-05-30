/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { create } from 'zustand';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';
import JitsiConnection from 'lib-jitsi-meet/types/hand-crafted/JitsiConnection';

export type JitsiStore = {
  connection: JitsiConnection | undefined;
  conference: JitsiConference | undefined;
  roomName: string | undefined;
  isJoined: boolean;
  setConnection: (connection: JitsiConnection) => void;
  setConference: (conference: JitsiConference) => void;
  setRoomName: (roomName: string) => void;
  join: () => void;
  leave: () => void;
};

export const useJitsiStore = create<JitsiStore>(set => ({
  connection: undefined,
  conference: undefined,
  roomName: undefined,
  isJoined: false,
  setConnection: (connection: JitsiConnection) =>
    set(() => ({
      connection: connection
    })),
  setConference: (conference: JitsiConference) =>
    set(() => ({
      conference: conference
    })),
  setRoomName: (roomName: string) =>
    set(() => ({
      roomName: roomName
    })),
  join: () =>
    set(() => ({
      isJoined: true
    })),
  leave: () =>
    set(() => ({
      isJoined: false
    }))
}));
