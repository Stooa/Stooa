/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getAuthToken } from '@/user/auth';
import { getBackendSafeRoomName, dispatchEvent } from '@/lib/helpers';
import {
  CONFERENCE_IS_LOCKABLE,
  CONFERENCE_PASSWORD_REQUIRED,
  CONFERENCE_START,
  CONFERENCE_BREAKOUT_ROOMS_UPDATED,
  CONNECTION_ESTABLISHED_FINISHED,
  PERMISSION_CHANGED,
  REACTION_MESSAGE_RECEIVED,
  SCREEN_SHARE_START,
  SCREEN_SHARE_STOP,
  RECORDING_START,
  RECORDING_STOP
} from '@/jitsi/Events';
import { connectionOptions, initOptions, roomOptions } from '@/jitsi/Globals';
import seatsRepository from '@/jitsi/Seats';
import tracksRepository from '@/jitsi/Tracks';
import userRepository from '@/jitsi/User';
import localTracksRepository from '@/jitsi/LocalTracks';
import { join } from '../jitsi';

const conferenceRepository = () => {
  let connection;
  let roomName;
  let userName;
  let conference;
  let room;
  let _room;
  let _roomName;
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
    console.log('Joining to conference ---->');
    if (conference) await conference.join();
  };

  const leaveUser = id => {
    if (id === undefined) {
      id = conference.myUserId();
    }

    seatsRepository.leave(id);
    tracksRepository.removeTracks(id);

    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] User leave', id);
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

    if (property === 'screenShare' && newValue !== undefined) {
      dispatchEvent(newValue === 'true' ? SCREEN_SHARE_START : SCREEN_SHARE_STOP);

      return;
    }

    if (property === 'recording' && newValue !== undefined) {
      dispatchEvent(newValue === 'true' ? RECORDING_START : RECORDING_STOP);

      return;
    }

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
    console.log('HANDLE CONFERENCE JOIN ------>');
    isJoined = true;

    conference.setDisplayName(userName);
    conference.setLocalParticipantProperty('twitter', twitter);
    conference.setLocalParticipantProperty('linkedin', linkedin);
    conference.setLocalParticipantProperty('isModerator', isModerator);

    userRepository.setUser({ id: conference.myUserId() });

    // FIXME: this is problematic
    dispatchEvent(CONFERENCE_START, { status: true, myUserId: conference.myUserId() });

    console.log('[STOOA] Handle conference join');
  };

  const joinRoom = async roomName => {
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
          DOMINANT_SPEAKER_CHANGED,
          MESSAGE_RECEIVED,
          BREAKOUT_ROOMS_UPDATED,
          BREAKOUT_ROOMS_MOVE_TO_ROOM
        }
      },
      errors: {
        conference: { PASSWORD_REQUIRED, PASSWORD_NOT_SUPPORTED }
      }
    } = JitsiMeetJS;

    _roomName = roomName;

    const localTracks = await localTracksRepository.createLocalTracks();

    localTracks.forEach(track => {
      tracksRepository.syncLocalStorageTrack(track);
    });

    // initializeConnection(_roomName, true);
    await conference.leave();
    isJoined = false;

    conference = connection.initJitsiConference(roomName, roomOptions);
    window.conference = conference;

    conference.on(PARTICIPANT_CONN_STATUS_CHANGED, _handleParticipantConnectionStatusChanged);
    conference.on(PARTICIPANT_PROPERTY_CHANGED, _handleParticipantPropertyChanged);
    conference.on(TRACK_ADDED, tracksRepository.handleTrackAdded);
    conference.on(TRACK_REMOVED, tracksRepository.handleTrackRemoved);
    conference.on(TRACK_MUTE_CHANGED, tracksRepository.handleTrackMuteChanged);
    conference.on(USER_JOINED, userRepository.handleUserJoin);
    conference.on(USER_LEFT, userRepository.handleUserLeft);
    conference.on(KICKED, userRepository.handleUserKicked);
    conference.on(CONFERENCE_JOINED, _handleConferenceJoin);
    conference.on(CONFERENCE_FAILED, _handleConferenceFailed);
    conference.on(CONFERENCE_ERROR, _handleConferenceError);
    conference.on(DOMINANT_SPEAKER_CHANGED, _handleDominantSpeakerChanged);
    conference.on(USER_ROLE_CHANGED, _handleUserRoleChanged);
    conference.on(MESSAGE_RECEIVED, _handleMessageReceived);
    conference.on(PASSWORD_REQUIRED, _handlePasswordRequired);
    conference.on(PASSWORD_NOT_SUPPORTED, _handlePasswordNotSupported);
    conference.addCommandListener('join', _handleCommandJoin);
    conference.addCommandListener('leave', _handleCommandLeave);
    conference.on(BREAKOUT_ROOMS_UPDATED, _handleBreakoutRoomsUpdated);
    conference.on(BREAKOUT_ROOMS_MOVE_TO_ROOM, _handleBreakoutRoomMove);

    // conference.join();
    dispatchEvent(CONNECTION_ESTABLISHED_FINISHED);
    setTimeout(() => {
      _handleConferenceJoin();
    }, 1000);
  };

  const _handleConferenceFailed = error => {
    if (error === 'conference.authenticationRequired') {
      dispatchEvent(CONFERENCE_PASSWORD_REQUIRED);
    }
  };

  const _handleConferenceError = error => {
    console.log('[STOOA] Conference error', error);
  };

  const _handleDominantSpeakerChanged = id => {
    seatsRepository.updateDominantSpeaker(id);
  };

  const _handleUserRoleChanged = () => {
    const role = conference.getRole();
    console.log('[STOOA] User role changed', conference.getRole());

    if (role === 'moderator') {
      dispatchEvent(CONFERENCE_IS_LOCKABLE);
    }
  };

  const _handleCommandJoin = values => {
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

  const _handleMessageReceived = (id, text, timestamp) => {
    dispatchEvent(REACTION_MESSAGE_RECEIVED, { id, text, timestamp });
  };

  const _handlePasswordRequired = () => {
    console.log('[STOOA] Password required');
  };

  const _handlePasswordNotSupported = () => {
    console.log('[STOOA] Password not supported');
  };

  const _handleBreakoutRoomsUpdated = params => {
    console.log('UPDATED ROOM', params);
    dispatchEvent(CONFERENCE_BREAKOUT_ROOMS_UPDATED);
  };

  const _handleBreakoutRoomMove = params => {
    console.log('MOVE TO ROOM', params);

    joinRoom(params);
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
          DOMINANT_SPEAKER_CHANGED,
          MESSAGE_RECEIVED,
          BREAKOUT_ROOMS_UPDATED,
          BREAKOUT_ROOMS_MOVE_TO_ROOM
        }
      },
      errors: {
        conference: { PASSWORD_REQUIRED, PASSWORD_NOT_SUPPORTED }
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
    conference.on(KICKED, userRepository.handleUserKicked);
    conference.on(CONFERENCE_JOINED, _handleConferenceJoin);
    conference.on(CONFERENCE_FAILED, _handleConferenceFailed);
    conference.on(CONFERENCE_ERROR, _handleConferenceError);
    conference.on(DOMINANT_SPEAKER_CHANGED, _handleDominantSpeakerChanged);
    conference.on(USER_ROLE_CHANGED, _handleUserRoleChanged);
    conference.on(MESSAGE_RECEIVED, _handleMessageReceived);
    conference.on(PASSWORD_REQUIRED, _handlePasswordRequired);
    conference.on(PASSWORD_NOT_SUPPORTED, _handlePasswordNotSupported);
    conference.addCommandListener('join', _handleCommandJoin);
    conference.addCommandListener('leave', _handleCommandLeave);
    conference.on(BREAKOUT_ROOMS_UPDATED, _handleBreakoutRoomsUpdated);
    conference.on(BREAKOUT_ROOMS_MOVE_TO_ROOM, _handleBreakoutRoomMove);

    dispatchEvent(CONNECTION_ESTABLISHED_FINISHED);
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

  const _handlePermissionChanged = permissions => {
    if (permissions) dispatchEvent(PERMISSION_CHANGED, permissions);
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
      auth ? auth.token : process.env.NEXT_PUBLIC_GUEST_TOKEN ?? null,
      connectionOptions(roomName)
    );

    connection.addEventListener(CONNECTION_ESTABLISHED, _handleConnectionEstablished);
    connection.addEventListener(CONNECTION_FAILED, _handleConnectionFailed);
    connection.addEventListener(CONNECTION_DISCONNECTED, _handleConnectionDisconnected);

    connection.connect();
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
    console.log('---->', isJoined);
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

  // BREAKOUT ROOMS

  const createBreakoutRoom = name => {
    if (!isModerator) {
      return;
    }
    try {
      conference.getBreakoutRooms().createBreakoutRoom(name);
    } catch (error) {
      throw new Error(error);
    }
  };

  const getBreakoutRooms = () => {
    if (conference) {
      return conference.getBreakoutRooms();
    }
  };

  /**
   *
   * @param {string} participantJid Participant Identification
   * @param {string} roomId Room Identification
   */
  const sendParticipantToRoom = (participantJid, roomId) => {
    const { _rooms } = getBreakoutRooms();
    const room = _rooms[roomId];

    if (!room) {
      console.error(`Invalid room: ${roomId}`);

      return;
    }

    console.log('TRYING to move this guy', participantJid, 'to room', room.jid);
    conference.getBreakoutRooms().sendParticipantToRoom(participantJid, room.jid);
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
    lockConference,
    joinConference,
    joinPrivateConference,
    kickParticipant,
    leave,
    sendJoinEvent,
    sendLeaveEvent,
    sendTextMessage,
    startScreenShareEvent,
    stopScreenShareEvent,
    getLocalTracks,
    getParticipantsIds,
    startRecordingEvent,
    stopRecordingEvent,
    createBreakoutRoom,
    getBreakoutRooms,
    sendParticipantToRoom
  };
};

export default conferenceRepository();
