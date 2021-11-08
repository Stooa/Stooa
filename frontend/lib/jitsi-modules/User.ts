/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User, UserRepository } from '@/types/user';
import seatsRepository from '@/jitsi/Seats';
import { removeItem } from 'lib/helpers';

type StorageValue = string|boolean|MediaDeviceInfo;

const userRepository = (): UserRepository => {
  let users: User[] = [];

  const _getUserValue = (value: keyof User, defaultValue: StorageValue = ''): StorageValue => {
    const user = getUser();

    return user?.[value] || defaultValue;
  };

  const clearUser = (): void => {
    sessionStorage.removeItem('user');
  };

  const setUser = (value: User): void => {
    const user = getUser();
    const updatedUser = {
      ...user,
      ...value
    };

    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getUser = (): User => {
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

  const handleUserJoin = (id: string, user: User): void => {
    users.push(user);

    console.log('[STOOA] Handle userRepository join', user);
  };

  const handleUserLeft = (id: string, user: User): void => {
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
