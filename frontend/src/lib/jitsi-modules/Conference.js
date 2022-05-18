/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getAuthToken } from '@/lib/auth';
import { getBackendSafeRoomName, dispatchEvent } from '@/lib/helpers';
import { CONFERENCE_START, PERMISSION_CHANGED } from '@/jitsi/Events';
import { connectionOptions, initOptions, roomOptions } from '@/jitsi/Globals';
import seatsRepository from '@/jitsi/Seats';
import tracksRepository from '@/jitsi/Tracks';
import userRepository from '@/jitsi/User';

const conferenceRepository = () => {
  let connection;
  let roomName;
  let userName;
  let conference;
  let isModerator = false;
  let isJoined = false;
  let twitter = false;
  let linkedin = false;

  const joinUser = (id, user) => {
    if (id === undefined || id === null) {
      id = conference.myUserId();
    }
    const seat = seatsRepository.join(id);
    tracksRepository.createTracks(id, seat, user);
    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] Join', id);
  };

  const leaveUser = id => {
    if (id === undefined) {
      id = conference.myUserId();
    }

    seatsRepository.leave(id);
    tracksRepository.removeTracks(id);

    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] Leave', id);
  };

  const _handleParticipantConnectionStatusChanged = (id, status) => {
    seatsRepository.updateStatus(id, status);
    console.log('[STOOA] Handle participant connection status changed', id, status);
  };

  const _handleParticipantPropertyChanged = (user, property, oldValue, newValue) => {
    console.log(
      '[STOOA] Handle participant property changed',
      user.getId(),
      property,
      oldValue,
      newValue
    );

    if (property === 'joined') {
      const id = user.getId();

      if (newValue === 'yes') {
        joinUser(id);

        return;
      }

      leaveUser(id);
    }
  };

  const _handleConnectionFailed = error => {
    console.error('[STOOA] Handle connection failed', error);
  };

  const _handleConferenceJoin = () => {
    isJoined = true;

    conference.setDisplayName(userName);
    conference.setLocalParticipantProperty('twitter', twitter);
    conference.setLocalParticipantProperty('linkedin', linkedin);
    conference.setLocalParticipantProperty('isModerator', isModerator);

    userRepository.setUser({ id: conference.myUserId() });

    dispatchEvent(CONFERENCE_START, { status: true, myUserId: conference.myUserId() });

    console.log('[STOOA] Handle conference join');
  };

  const _handleConferenceFailed = error => {
    console.log('[STOOA] Conference failed', error);
  };

  const _handleConferenceError = error => {
    console.log('[STOOA] Conference error', error);
  };

  const _handleDominantSpeakerChanged = id => {
    seatsRepository.updateDominantSpeaker(id);
  };

  const _handleUserRoleChanged = () => {
    console.log('[STOOA] User role changed', conference.getRole());
  };

  const _handleCommnandJoin = values => {
    const { value } = values;
    const seat = seatsRepository.join(value);

    tracksRepository.createTracks(value, seat);
    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] Join', value);
  };

  const _handleCommandLeave = values => {
    const { value } = values;

    seatsRepository.leave(value);
    tracksRepository.removeTracks(value);
    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] Leave', value);
  };

  const _handleConnectionEstablished = async () => {
    const {
      events: {
        conference: {
          PARTICIPANT_CONN_STATUS_CHANGED,
          PARTICIPANT_PROPERTY_CHANGED,
          TRACK_ADDED,
          TRACK_REMOVED,
          TRACK_MUTE_CHANGED,
          USER_JOINED,
          USER_LEFT,
          USER_ROLE_CHANGED,
          KICKED,
          CONFERENCE_JOINED,
          CONFERENCE_FAILED,
          CONFERENCE_ERROR,
          DOMINANT_SPEAKER_CHANGED
        }
      }
    } = JitsiMeetJS;

    conference = connection.initJitsiConference(roomName, roomOptions);
    window.conference = conference;

    conference.on(PARTICIPANT_CONN_STATUS_CHANGED, _handleParticipantConnectionStatusChanged);
    conference.on(PARTICIPANT_PROPERTY_CHANGED, _handleParticipantPropertyChanged);
    conference.on(TRACK_ADDED, tracksRepository.handleTrackAdded);
    conference.on(TRACK_REMOVED, tracksRepository.handleTrackRemoved);
    conference.on(TRACK_MUTE_CHANGED, tracksRepository.handleTrackMuteChanged);
    conference.on(USER_JOINED, userRepository.handleUserJoin);
    conference.on(USER_LEFT, userRepository.handleUserLeft);
    conference.on(KICKED, userRepository.handleUserLeft);
    conference.on(CONFERENCE_JOINED, _handleConferenceJoin);
    conference.on(CONFERENCE_FAILED, _handleConferenceFailed);
    conference.on(CONFERENCE_ERROR, _handleConferenceError);
    conference.on(DOMINANT_SPEAKER_CHANGED, _handleDominantSpeakerChanged);
    conference.on(USER_ROLE_CHANGED, _handleUserRoleChanged);
    conference.addCommandListener('join', _handleCommnandJoin);
    conference.addCommandListener('leave', _handleCommandLeave);

    await conference.join();
  };

  const _handleConnectionDisconnected = () => {
    const {
      events: {
        connection: { CONNECTION_ESTABLISHED, CONNECTION_FAILED, CONNECTION_DISCONNECTED }
      }
    } = JitsiMeetJS;

    connection.removeEventListener(CONNECTION_ESTABLISHED, _handleConnectionEstablished);
    connection.removeEventListener(CONNECTION_FAILED, _handleConnectionFailed);
    connection.removeEventListener(CONNECTION_DISCONNECTED, _handleConnectionDisconnected);

    console.log('[STOOA] Handle connection disconnected');
  };

  const _handlePermissionIsShown = environmentType => {
    console.log('[STOOA] Permission prompt is shown for:', environmentType);
  };

  const _handleUserMediaSlowPromiseTimeout = () => {
    console.log('[STOOA] User media slow promise timeout');
  };

  const _handlePermissionChanged = (permissions) => {
    if(permissions) dispatchEvent(PERMISSION_CHANGED, permissions);
    console.log('[STOOA] Permission changed');
  };

  const initializeJitsi = () => {
    const {
      events: {
        mediaDevices: {
          PERMISSION_PROMPT_IS_SHOWN,
          USER_MEDIA_SLOW_PROMISE_TIMEOUT,
          PERMISSIONS_CHANGED
        }
      }
    } = JitsiMeetJS;

    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    JitsiMeetJS.init(initOptions);

    JitsiMeetJS.mediaDevices.addEventListener(PERMISSION_PROMPT_IS_SHOWN, _handlePermissionIsShown);
    JitsiMeetJS.mediaDevices.addEventListener(
      USER_MEDIA_SLOW_PROMISE_TIMEOUT,
      _handleUserMediaSlowPromiseTimeout
    );
    JitsiMeetJS.mediaDevices.addEventListener(PERMISSIONS_CHANGED, _handlePermissionChanged);
  };

  const initializeConnection = async (rawRoomName, isUserModerator) => {
    const {
      events: {
        connection: { CONNECTION_ESTABLISHED, CONNECTION_FAILED, CONNECTION_DISCONNECTED }
      }
    } = JitsiMeetJS;
    const auth = await getAuthToken(true, rawRoomName);

    isModerator = isUserModerator;

    setUsername(auth ? auth.user : null);

    roomName = getBackendSafeRoomName(rawRoomName);

    connection = new JitsiMeetJS.JitsiConnection(
      null,
      isUserModerator && auth ? auth.token : null,
      connectionOptions(roomName)
    );

    connection.addEventListener(CONNECTION_ESTABLISHED, _handleConnectionEstablished);
    connection.addEventListener(CONNECTION_FAILED, _handleConnectionFailed);
    connection.addEventListener(CONNECTION_DISCONNECTED, _handleConnectionDisconnected);

    connection.connect();
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

  const sendJoinEvent = user => {
    if (isJoined) {
      conference.setLocalParticipantProperty('joined', 'yes');
      joinUser(null, user);
    }
  };

  const sendLeaveEvent = () => {
    if (isJoined) {
      conference.setLocalParticipantProperty('joined', 'no');
      leaveUser();
    }
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
      joined: conference.getLocalParticipantProperty('joined') === 'yes',
      isMuted: tracksRepository.isLocalParticipantMuted(id, 'audio'),
      isVideoMuted: tracksRepository.isLocalParticipantMuted(id, 'video')
    };
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
    initializeJitsi,
    initializeConnection,
    leave,
    sendJoinEvent,
    sendLeaveEvent,
  };
};

export default conferenceRepository();
