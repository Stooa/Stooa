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
import { dispatchEvent, removeItem } from '@/lib/helpers';
import { USER_KICKED } from '@/jitsi/Events';

const userRepository = (): UserRepository => {
  let users: User[] = [];

  const clearUser = (): void => {
    localStorage.removeItem('user');
  };

  const setUser = (value: User): void => {
    const user = getUser();
    const updatedUser = {
      ...user,
      ...value
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getUser = (): User => {
    if (typeof localStorage === 'undefined') return {};
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  };

  const getUserGuestId = () => getUser()?.guestId || null;
  const getUserNickname = () => getUser()?.nickname ?? '';
  const getUserAudioInput = () => getUser()?.audioInput || null;
  const getUserAudioOutput = () => getUser()?.audioOutput || null;
  const getUserVideoInput = () => getUser()?.videoInput || null;
  const getUserAudioMuted = () => getUser()?.audioMuted || false;
  const getUserVideoMuted = () => getUser()?.videoMuted || false;

  const setUserAudioInput = (audioInput: MediaDeviceInfo): void => setUser({ audioInput });
  const setUserAudioOutput = (audioOutput: MediaDeviceInfo): void => setUser({ audioOutput });
  const setUserVideoInput = (videoInput: MediaDeviceInfo): void => setUser({ videoInput });
  const setUserAudioMuted = (audioMuted: boolean): void => setUser({ audioMuted });
  const setUserVideoMuted = (videoMuted: boolean): void => setUser({ videoMuted });
  const setUserNickname = (nickname: string): void => setUser({ nickname });

  const handleUserJoin = (id: string, user: User): void => {
    users.push(user);

    console.log('[STOOA] Handle userRepository join', user);
  };

  const handleUserLeft = (id: string, user: User): void => {
    users = removeItem(users, user);
    seatsRepository.leave(id);

    console.log('[STOOA] Handle userRepository left', user);
  };

  const handleUserKicked = (participant: User, reason: string): void => {
    console.log('[STOOA] Handle user kicked', participant, reason);

    dispatchEvent(USER_KICKED, { participant: participant, reason: reason });
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
    handleUserKicked,
    setUser,
    setUserAudioInput,
    setUserAudioMuted,
    setUserAudioOutput,
    setUserVideoInput,
    setUserVideoMuted,
    setUserNickname
  };
};

export default userRepository();
