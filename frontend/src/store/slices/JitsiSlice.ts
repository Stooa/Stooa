/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiConference from 'JitsiConference';
import JitsiConnection from 'JitsiConnection';
import { DevtoolsStateCreator, JitsiStore } from '@/store';

export interface JitsiSlice {
  connection: JitsiConnection | undefined;
  conference: JitsiConference | undefined;
  roomName: string | undefined;
  userId: string | undefined;
  isJoined: boolean;
  setConnection: (connection: JitsiConnection) => void;
  getConnection: () => JitsiConnection;
  setConference: (conference: JitsiConference) => void;
  getConference: () => JitsiConference;
  join: () => void;
  leave: () => void;
  setRoomName: (roomName: string) => void;
}

export const createJitsiSlice: DevtoolsStateCreator<JitsiStore, JitsiSlice> = (set, get) => ({
  connection: undefined,
  conference: undefined,
  isJoined: false,
  userId: undefined,
  roomName: undefined,
  setConnection: (connection: JitsiConnection) =>
    set({ connection }, false, { type: 'setConnection', context: { connection } }),
  getConnection: () => {
    const { connection } = get();

    if (!connection) {
      throw new Error('Connection not found');
    }

    return connection;
  },
  setConference: (conference: JitsiConference) =>
    set({ conference, userId: conference.myUserId() }, false, {
      type: 'setConference',
      context: { conference }
    }),
  getConference: () => {
    const { conference } = get();

    if (!conference) {
      throw new Error('Conference not found');
    }

    return conference;
  },
  join: () => set({ isJoined: true }, false, { type: 'join' }),
  leave: () => set({ isJoined: false }, false, { type: 'leave' }),
  setRoomName: (roomName: string) =>
    set({ roomName }, false, { type: 'setRoomName', context: { roomName } })
});
