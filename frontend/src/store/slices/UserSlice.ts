/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DevtoolsStateCreator, JitsiStore } from '@/store';

export interface UserSlice {
  userName: string | undefined;
  isModerator: boolean;
  twitter: string | false;
  linkedin: string | false;
  changeUserName: (userName: string) => void;
  getUserName: () => string | undefined;
  makeModerator: () => void;
  getIsModerator: () => boolean;
  setTwitter: (twitter: string) => void;
  getTwitter: () => string | false;
  setLinkedin: (linkedin: string) => void;
  getLinkedin: () => string | false;
}

export const createUserSlice: DevtoolsStateCreator<JitsiStore, UserSlice> = (set, get) => ({
  userName: undefined,
  isModerator: false,
  twitter: false,
  linkedin: false,
  changeUserName: (userName: string) =>
    set({ userName }, false, { type: 'changeUserName', context: { userName } }),
  getUserName: () => get().userName,
  makeModerator: () => set({ isModerator: true }, false, { type: 'makeModerator' }),
  getIsModerator: () => get().isModerator,
  setTwitter: (twitter: string) =>
    set({ twitter }, false, { type: 'setTwitter', context: { twitter } }),
  getTwitter: () => get().twitter,
  setLinkedin: (linkedin: string) =>
    set({ linkedin }, false, { type: 'setLinkedin', context: { linkedin } }),
  getLinkedin: () => get().linkedin
});
