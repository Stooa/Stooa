/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User, UserRepository } from '@/types/user';
import { useSeats } from '@/jitsi';
import { dispatchEvent } from '@/lib/helpers';
import { MODERATOR_LEFT, USER_KICKED, USER_LEFT_CONFERENCE } from '@/jitsi/Events';
import { useJitsiStore } from '@/store';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { useEventType } from '@/hooks/useEventType';
import { FISHBOWL, WORLD_CAFE } from '@/types/event-types';

export const useUser = (): UserRepository => {
  const { leave } = useSeats();
  const { userJoined, userLeft } = useJitsiStore(store => ({
    userJoined: store.userJoined,
    userLeft: store.userLeft
  }));
  const { addWorldCafeParticipant } = useWorldCafeStore(store => ({
    addWorldCafeParticipant: store.addWorldCafeParticipant
  }));
  const { eventType } = useEventType();

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
  const getUserParticipantId = () => getUser()?.participantId || '';
  const getUserParticipantSlug = () => getUser()?.participantSlug || '';
  const getUserFeedback = () =>
    getUser()?.feedback || {
      feedbackId: '',
      feedbackFishbowlSlug: '',
      fromThankYou: false
    };
  const setUserFeedback = ({
    feedbackId,
    feedbackFishbowlSlug,
    fromThankYou
  }: {
    feedbackId: string;
    feedbackFishbowlSlug: string;
    fromThankYou: boolean;
  }): void => setUser({ feedback: { feedbackId, feedbackFishbowlSlug, fromThankYou } });
  const setUserParticipantSlug = (participantSlug: string): void => setUser({ participantSlug });
  const setUserAudioInput = (audioInput: MediaDeviceInfo): void => setUser({ audioInput });
  const setUserAudioOutput = (audioOutput: MediaDeviceInfo): void => setUser({ audioOutput });
  const setUserVideoInput = (videoInput: MediaDeviceInfo): void => setUser({ videoInput });
  const setUserAudioMuted = (audioMuted: boolean): void => setUser({ audioMuted });
  const setUserVideoMuted = (videoMuted: boolean): void => setUser({ videoMuted });
  const setUserNickname = (nickname: string): void => setUser({ nickname });
  const setUserParticipantId = (participantId: string): void => setUser({ participantId });

  const handleUserJoin = (id: string, user: User): void => {
    userJoined(user);

    // TODO: Check nickname
    if (eventType === WORLD_CAFE && user) {
      addWorldCafeParticipant({ id, nickname: '' });
    }

    console.log('[STOOA] Handle userRepository join', user, id);
  };

  const handleUserLeft = (id: string, user: User): void => {
    userLeft(user);
    if (eventType === FISHBOWL) {
      leave(id);
    } else {
      dispatchEvent(USER_LEFT_CONFERENCE, { user: user });
    }

    if (user._role === 'moderator') {
      dispatchEvent(MODERATOR_LEFT);
    }

    console.log('[STOOA] Handle userRepository left', user);
  };

  const handleUserKicked = (participant: User, reason: string): void => {
    console.log('[STOOA] Handle user kicked', participant, reason);

    dispatchEvent(USER_KICKED, { participant: participant, reason: reason });
  };

  const hasUserGaveFeedback = (fishbowlSlug: string): boolean => {
    const { feedbackFishbowlSlug } = getUserFeedback();
    return feedbackFishbowlSlug === fishbowlSlug;
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
    setUserNickname,
    setUserParticipantId,
    getUserParticipantId,
    setUserFeedback,
    getUserFeedback,
    setUserParticipantSlug,
    getUserParticipantSlug,
    hasUserGaveFeedback
  };
};
