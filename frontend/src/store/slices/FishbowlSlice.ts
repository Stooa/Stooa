/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User } from '@/types/user';
import { DevtoolsStateCreator, JitsiStore } from '@/store';

export interface FishbowlSlice {
  users: User[];
  seats: Array<string | undefined>;
  userJoined: (user: User) => void;
  userLeft: (user: User) => void;
  createSeats: (seats: number) => Array<string | undefined>;
  findSeat: (id: string) => number | undefined;
  findEmptySeat: () => number | undefined;
  getOccupiedSeats: () => string[];
  sit: (id: string, seat: number) => void;
  stand: (seat: number) => void;
  count: () => number;
}

export const createFishbowlSlice: DevtoolsStateCreator<JitsiStore, FishbowlSlice> = (set, get) => ({
  users: [],
  seats: [],
  userJoined: (user: User) =>
    set(
      state => {
        const users = [...state.users, user];

        return { users };
      },
      false,
      { type: 'userJoined', context: { user } }
    ),
  userLeft: (user: User) =>
    set(
      state => {
        const users = state.users.filter(u => u.id !== user.id);

        return { users };
      },
      false,
      { type: 'userLeft', context: { user } }
    ),
  createSeats: (seats: number) => {
    set({ seats: Array.from({ length: seats }) }, false, {
      type: 'createSeats',
      context: { seats }
    });

    return get().seats;
  },
  getSeats: () => get().seats,
  findSeat: (id: string): number | undefined => {
    const { seats } = get();
    const seat = seats.findIndex(seat => seat === id) + 1;

    return seat === 0 ? undefined : seat;
  },
  findEmptySeat: (): number | undefined => {
    const { seats } = get();
    const seat = seats.findIndex(seat => seat === undefined) + 1;

    return seat === 0 ? undefined : seat;
  },
  getOccupiedSeats: (): string[] => {
    const { seats } = get();

    return seats.filter(seat => seat !== undefined) as string[];
  },
  sit: (id: string, seat: number) =>
    set(
      ({ seats }) => {
        seats[seat - 1] = id;

        return { seats };
      },
      false,
      { type: 'sit', context: { id, seat } }
    ),
  stand: (seat: number) =>
    set(
      ({ seats }) => {
        seats[seat - 1] = undefined;

        return { seats };
      },
      false,
      { type: 'stand', context: { seat } }
    ),
  count: () => get().seats.filter(seat => seat === undefined).length
});
