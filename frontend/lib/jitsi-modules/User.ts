/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import seatsRepository from '@/jitsi/Seats';
import { removeItem } from 'lib/helpers';

export interface UserInterface {
  id?: string|boolean; // TODO: is boolean a valid id? Where the boolean comes from?
  guestId?: string;
  nickname?: string;
  audioInput?: MediaDeviceInfo;
  audioOutput?: MediaDeviceInfo;
  videoInput?: MediaDeviceInfo;
  audioMuted?: boolean;
  videoMuted?: boolean;
}

interface UserRepositoryInterface {
  clearUser: () => void;
  getUser: () => UserInterface;
  getUserAudioInput: () => MediaDeviceInfo|null;
  getUserAudioMuted: () => boolean;
  getUserAudioOutput: () => MediaDeviceInfo|null;
  getUserGuestId: () => string|null;
  getUserNickname: () => string|null;
  getUserVideoInput: () => MediaDeviceInfo|null;
  getUserVideoMuted: () => boolean;
  handleUserJoin: (id: string, user: UserInterface) => void;
  handleUserLeft: (id: string, user: UserInterface) => void;
  setUser: (value: UserInterface) => void;
  setUserAudioInput: (audioInput: MediaDeviceInfo) => void;
  setUserAudioMuted: (audioMuted: boolean) => void;
  setUserAudioOutput: (audioOutput: MediaDeviceInfo) => void;
  setUserVideoInput: (videoInput: MediaDeviceInfo) => void;
  setUserVideoMuted: (videoMuted: boolean) => void;
}

const userRepository = (): UserRepositoryInterface => {
  let users: UserInterface[] = [];

  const _getUserValue = (value: keyof UserInterface, defaultValue: string|boolean|MediaDeviceInfo = ''): string|boolean|MediaDeviceInfo => {
    const user = getUser();

    return user?.[value] || defaultValue;
  };

  const clearUser = (): void => {
    sessionStorage.removeItem('user');
  };

  const setUser = (value: UserInterface): void => {
    const user = getUser();
    const updatedUser = {
      ...user,
      ...value
    };

    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getUser = (): UserInterface => {
    if (typeof sessionStorage === 'undefined') return {};
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  };

  const getUserGuestId = () => _getUserValue('guestId');
  const getUserNickname = () => _getUserValue('nickname');
  const getUserAudioInput = () => _getUserValue('audioInput', null);
  const getUserAudioOutput = () => _getUserValue('audioOutput', null);
  const getUserVideoInput = () => _getUserValue('videoInput', null);
  const getUserAudioMuted = () => _getUserValue('audioMuted', false);
  const getUserVideoMuted = () => _getUserValue('videoMuted', false);

  const setUserAudioInput = (audioInput: MediaDeviceInfo): void => setUser({ audioInput });
  const setUserAudioOutput = (audioOutput: MediaDeviceInfo): void => setUser({ audioOutput });
  const setUserVideoInput = (videoInput: MediaDeviceInfo): void => setUser({ videoInput });
  const setUserAudioMuted = (audioMuted: boolean): void => setUser({ audioMuted });
  const setUserVideoMuted = (videoMuted: boolean): void => setUser({ videoMuted });

  const handleUserJoin = (id: string, user: UserInterface): void => {
    users.push(user);

    console.log('[STOOA] Handle userRepository join', user);
  };

  const handleUserLeft = (id: string, user: UserInterface): void => {
    users = removeItem(users, user);
    seatsRepository.leave(id);

    console.log('[STOOA] Handle userRepository left', user);
  };

  return {
    clearUser,
    getUser,
    getUserAudioInput,
    getUserAudioMuted,
    getUserAudioOutput,
    getUserGuestId,
    getUserNickname,
    getUserVideoInput,
    getUserVideoMuted,
    handleUserJoin,
    handleUserLeft,
    setUser,
    setUserAudioInput,
    setUserAudioMuted,
    setUserAudioOutput,
    setUserVideoInput,
    setUserVideoMuted
  };
};

export default userRepository();
