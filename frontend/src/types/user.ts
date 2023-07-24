/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface User {
  id?: string;
  guestId?: string;
  participantId?: string;
  participantSlug?: string;
  feedback?: {
    feedbackId: string;
    feedbackFishbowlSlug: string;
    fromThankYou: boolean;
  };
  nickname?: string;
  name?: string;
  isCurrentUser?: boolean;
  audioInput?: MediaDeviceInfo;
  audioOutput?: MediaDeviceInfo;
  videoInput?: MediaDeviceInfo;
  audioMuted?: boolean;
  videoMuted?: boolean;
  _role?: string;
  _properties?: {
    features_jigasi?: boolean;
  };
  getDisplayName?: () => string;
}

export interface UserRepository {
  clearUser: () => void;
  getUser: () => User;
  getUserAudioInput: () => MediaDeviceInfo | null;
  getUserAudioMuted: () => boolean;
  getUserAudioOutput: () => MediaDeviceInfo | null;
  getUserGuestId: () => string | null;
  getUserNickname: () => string;
  getUserVideoInput: () => MediaDeviceInfo | null;
  getUserVideoMuted: () => boolean;
  handleUserJoin: (id: string, user: User) => void;
  handleUserLeft: (id: string, user: User) => void;
  handleUserKicked: (actorParticipant: User, reason: string) => void;
  setUser: (value: User) => void;
  setUserAudioInput: (audioInput: MediaDeviceInfo) => void;
  setUserAudioMuted: (audioMuted: boolean) => void;
  setUserAudioOutput: (audioOutput: MediaDeviceInfo) => void;
  setUserVideoInput: (videoInput: MediaDeviceInfo) => void;
  setUserVideoMuted: (videoMuted: boolean) => void;
  setUserNickname: (nickname: string) => void;
  setUserParticipantId: (participantId: string) => void;
  getUserParticipantId: () => string;
  setUserParticipantSlug: (participantSlug: string) => void;
  getUserParticipantSlug: () => string;
  getUserFeedback: () => {
    feedbackId: string;
    feedbackFishbowlSlug: string;
    fromThankYou: boolean;
  };
  setUserFeedback: ({
    feedbackId,
    feedbackFishbowlSlug,
    fromThankYou
  }: {
    feedbackId: string;
    feedbackFishbowlSlug: string;
    fromThankYou: boolean;
  }) => void;
  hasUserGaveFeedback: (fishbowlSLug: string) => boolean;
}
