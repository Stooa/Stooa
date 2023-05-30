/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import tracksRepository from '@/jitsi/Tracks';
import userRepository from '@/jitsi/User';

const conferenceRepository = () => {
  let connection;
  let userName;
  let conference;
  let isModerator = false;
  let isJoined = false;
  let twitter;
  let linkedin;

  /**
   * Join the jitsi private conference
   * @param {string | undefined} password
   */
  const joinPrivateConference = async password => {
    if (conference) await conference.join(password);
  };

  /**
   * Join the jitsi conference
   * @param {string | undefined} password
   */
  const joinConference = async () => {
    if (conference) await conference.join();
  };

  /**
   *
   * @param {string} password
   * @returns Promise
   */
  const lockConference = async password => {
    if (conference) {
      return await conference.lock(password);
    }
  };

  const getLocalAudioTrack = () => {
    if (!isJoined) {
      return undefined;
    }

    return conference.getLocalAudioTrack();
  };

  const getLocalVideoTrack = () => {
    if (!isJoined) {
      return undefined;
    }

    return conference.getLocalVideoTrack();
  };

  const addTrack = (track, oldTrack) => {
    if (!isJoined) {
      return;
    }

    if (oldTrack === undefined) {
      conference.addTrack(track);
      return;
    }

    tracksRepository.handleTrackRemoved(oldTrack);
    conference.replaceTrack(oldTrack, track);
  };

  const getParticipantById = id => conference.getParticipantById(id);

  const getParticipantNameById = id => {
    const participant = getParticipantById(id);
    return participant ? participant.getDisplayName() : userName;
  };

  const getMyUserId = () => {
    if (isJoined) {
      return conference.myUserId();
    }

    return false;
  };

  const leave = () => {
    console.log('[STOOA] Leave');

    if (isJoined) {
      isJoined = false;

      conference.leave();
      connection.disconnect();
    }
  };

  const startScreenShareEvent = () => {
    conference.setLocalParticipantProperty('screenShare', 'true');
  };

  const stopScreenShareEvent = () => {
    conference.setLocalParticipantProperty('screenShare', 'false');
  };

  const startRecordingEvent = () => {
    conference.setLocalParticipantProperty('recording', 'true');
  };

  const stopRecordingEvent = () => {
    conference.setLocalParticipantProperty('recording', 'false');
  };

  const setUsername = user => {
    if (user) {
      userName = user.name;
      twitter = user.twitter;
      linkedin = user.linkedin;
    } else {
      userName = userRepository.getUserNickname();
    }
  };

  const getParticipantCount = () => {
    if (isJoined) {
      return conference.getParticipantCount();
    }

    return 1;
  };

  const getParticipants = () => {
    if (isJoined) {
      return conference.getParticipants();
    }

    return [];
  };

  const getParticipantsIds = () => {
    const participantsIds = [];
    const participants = conference.getParticipants();

    participants.forEach(participant => {
      participantsIds.push(participant.getId());
    });

    participantsIds.push(getMyUserId());

    return participantsIds;
  };

  const getLocalParticipant = () => {
    if (!isJoined) {
      return null;
    }

    const id = getMyUserId();

    return {
      id,
      name: userName,
      twitter,
      linkedin,
      isModerator,
      isCurrentUser: true,
      joined:
        conference.isJoined() === null
          ? false
          : conference.getLocalParticipantProperty('joined') === 'yes',
      isMuted: tracksRepository.isLocalParticipantMuted(id, 'audio'),
      isVideoMuted: tracksRepository.isLocalParticipantMuted(id, 'video')
    };
  };

  const getLocalTracks = () => {
    if (!isJoined) {
      return [];
    }

    return conference.getLocalTracks();
  };

  const kickParticipant = (id, reason) => {
    conference.kickParticipant(id, reason);
  };

  const sendTextMessage = message => {
    if (isJoined) {
      conference.sendTextMessage(message);
    }
  };

  return {
    addTrack,
    getLocalVideoTrack,
    getLocalAudioTrack,
    getLocalParticipant,
    getMyUserId,
    getParticipantById,
    getParticipantCount,
    getParticipantNameById,
    getParticipants,
    lockConference,
    joinConference,
    joinPrivateConference,
    kickParticipant,
    leave,
    sendTextMessage,
    startScreenShareEvent,
    stopScreenShareEvent,
    getLocalTracks,
    getParticipantsIds,
    startRecordingEvent,
    stopRecordingEvent,

    setUsername
  };
};

export default conferenceRepository();
