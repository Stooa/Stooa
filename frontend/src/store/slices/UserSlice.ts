/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DevtoolsStateCreator, JitsiStore } from '@/store';
import { User } from '@/user/auth/authToken';

export interface UserSlice {
  userName: string | undefined;
  isModerator: boolean;
  twitter: string | false;
  linkedin: string | false;
  updateUser: (user: User) => void;
  makeModerator: () => void;
  getIsModerator: () => boolean;
}

export const createUserSlice: DevtoolsStateCreator<JitsiStore, UserSlice> = (set, get) => ({
  userName: undefined,
  isModerator: false,
  twitter: false,
  linkedin: false,
  updateUser: (user: User) =>
    set({ userName: user.name, twitter: user.twitter, linkedin: user.linkedin }, false, {
      type: 'updateUser',
      context: { user }
    }),
  makeModerator: () => set({ isModerator: true }, false, { type: 'makeModerator' }),
  getIsModerator: () => get().isModerator
});
