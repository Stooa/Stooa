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
  CONNECTION_ESTABLISHED_FINISHED,
  PERMISSION_CHANGED,
  REACTION_MESSAGE_RECEIVED,
  SCREEN_SHARE_START,
  SCREEN_SHARE_STOP,
  RECORDING_START,
  RECORDING_STOP,
  TRANSCRIPTION_MESSAGE_RECEIVED,
  TRANSCRIPTION_TRANSCRIBER_JOINED
} from '@/jitsi/Events';
import { connectionOptions, initOptions, roomOptions } from '@/jitsi/Globals';
import { useTracks, useSeats, useUser } from '@/jitsi';
import { useJitsiStore } from '@/store';

export const useConference = () => {
  const {
    connection,
    conference,
    userName,
    isModerator,
    isJoined,
    twitter,
    linkedin,
    userId: myUserId,
    updateUser,
    setConnection,
    getConnection,
    setConference,
    getConference,
    setRoomName,
    makeModerator,
    getIsModerator,
    join: setAsJoined,
    leave: setAsNotJoined
  } = useJitsiStore();
  const {
    createTracks,
    removeTracks,
    isLocalParticipantMuted,
    handleTrackAdded,
    handleTrackMuteChanged,
    handleTrackRemoved
  } = useTracks();
  const { setUser, handleUserJoin, handleUserLeft, handleUserKicked, getUserNickname } = useUser();
  const { join, getIds, leave: leaveSeat, updateStatus, updateDominantSpeaker } = useSeats();

  const joinUser = (id, user) => {
    const userId = id ?? myUserId;
    const seat = join(userId, getParticipantNameById(userId));

    createTracks(userId, seat, user);

    getConference().selectParticipants(getIds());

    console.log('[STOOA] Join', userId);
  };

  /**
   * Join the jitsi private conference
   * @param {string | undefined} password
   */
  const joinPrivateConference = async password => {
    await getConference().join(password);
  };

  /**
   * Join the jitsi conference
   * @param {string | undefined} password
   */
  const joinConference = async () => {
    await getConference().join();
  };

  const leaveUser = id => {
    const userId = id ?? myUserId;

    leaveSeat(userId);
    removeTracks(userId);

    conference.selectParticipants(getIds());

    console.log('[STOOA] User leave', userId);
  };

  const _handleParticipantConnectionStatusChanged = (id, status) => {
    updateStatus(id, status);
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

    if (property === 'features_jigasi' && newValue === true) {
      dispatchEvent(TRANSCRIPTION_TRANSCRIBER_JOINED, { joined: true });

      return;
    }
  };

  const _handleConnectionFailed = error => {
    console.error('[STOOA] Handle connection failed', error);
  };

  const _handleConferenceJoin = async () => {
    setAsJoined();

    const auth = await getAuthToken();

    const name = auth?.user ? auth.user.name : getUserNickname();
    const twitter = auth?.user.twitter;
    const linkedin = auth?.user.linkedin;

    updateUser({
      name,
      twitter,
      linkedin
    });

    const conference = getConference();

    conference.setDisplayName(name);
    conference.setLocalParticipantProperty('twitter', twitter);
    conference.setLocalParticipantProperty('linkedin', linkedin);
    conference.setLocalParticipantProperty('isModerator', getIsModerator());
    conference.setLocalParticipantProperty('requestingTranscription', false);

    setUser({ id: conference.myUserId() });

    dispatchEvent(CONFERENCE_START, { status: true, myUserId: conference.myUserId() });

    console.log('[STOOA] Handle conference join');
  };

  const _handleConferenceFailed = error => {
    console.log('[STOOA] Handle conference failed', error);

    if (error === 'conference.authenticationRequired') {
      dispatchEvent(CONFERENCE_PASSWORD_REQUIRED);
    }
    console.log('[STOOA] Handle conference failed', error);
  };

  const _handleConferenceError = error => {
    console.log('[STOOA] Conference error', error);
  };

  const _handleDominantSpeakerChanged = id => {
    updateDominantSpeaker(id);
  };

  const _handleUserRoleChanged = () => {
    const role = getConference().getRole();
    console.log('[STOOA] User role changed', getConference().getRole());

    if (role === 'moderator') {
      dispatchEvent(CONFERENCE_IS_LOCKABLE);
    }
  };

  const _handleCommandJoin = values => {
    const { value } = values;
    const seat = join(value);

    createTracks(value, seat);
    getConference().selectParticipants(getIds());

    console.log('[STOOA] Join', value);
  };

  const _handleCommandLeave = values => {
    const { value } = values;

    leaveSeat(value);
    removeTracks(value);
    getConference().selectParticipants(getIds());

    console.log('[STOOA] Leave', value);
  };

  const _handleEndpointMessageReceived = (participant, json) => {
    console.log('[STOOA] Endpoint message received', participant, json);

    if ((json && json.type === 'transcription-result') || json.type === 'translation-result') {
      dispatchEvent(TRANSCRIPTION_MESSAGE_RECEIVED, { data: json });
    }
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

  const _handleConnectionEstablished = async roomName => {
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
          ENDPOINT_MESSAGE_RECEIVED
        }
      },
      errors: {
        conference: { PASSWORD_REQUIRED, PASSWORD_NOT_SUPPORTED }
      }
    } = JitsiMeetJS;

    const conference = getConnection().initJitsiConference(roomName, roomOptions);

    window.conference = conference;

    conference.on(PARTICIPANT_CONN_STATUS_CHANGED, _handleParticipantConnectionStatusChanged);
    conference.on(PARTICIPANT_PROPERTY_CHANGED, _handleParticipantPropertyChanged);
    conference.on(TRACK_ADDED, handleTrackAdded);
    conference.on(TRACK_REMOVED, handleTrackRemoved);
    conference.on(TRACK_MUTE_CHANGED, handleTrackMuteChanged);
    conference.on(USER_JOINED, handleUserJoin);
    conference.on(USER_LEFT, _handleUserLeft);
    conference.on(KICKED, handleUserKicked);
    conference.on(CONFERENCE_JOINED, _handleConferenceJoin);
    conference.on(CONFERENCE_FAILED, _handleConferenceFailed);
    conference.on(CONFERENCE_ERROR, _handleConferenceError);
    conference.on(DOMINANT_SPEAKER_CHANGED, _handleDominantSpeakerChanged);
    conference.on(USER_ROLE_CHANGED, _handleUserRoleChanged);
    conference.on(MESSAGE_RECEIVED, _handleMessageReceived);
    conference.on(PASSWORD_REQUIRED, _handlePasswordRequired);
    conference.on(PASSWORD_NOT_SUPPORTED, _handlePasswordNotSupported);
    conference.on(ENDPOINT_MESSAGE_RECEIVED, _handleEndpointMessageReceived);
    conference.addCommandListener('join', _handleCommandJoin);
    conference.addCommandListener('leave', _handleCommandLeave);

    setConference(conference);

    dispatchEvent(CONNECTION_ESTABLISHED_FINISHED);
  };

  const _handleConnectionDisconnected = () => {
    const {
      events: {
        connection: { CONNECTION_ESTABLISHED, CONNECTION_FAILED, CONNECTION_DISCONNECTED }
      }
    } = JitsiMeetJS;

    const connection = getConnection();

    connection.removeEventListener(CONNECTION_ESTABLISHED, () =>
      _handleConnectionEstablished(roomName)
    );
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

  const _handleUserLeft = (id, user) => {
    if (user._properties?.features_jigasi) {
      dispatchEvent(TRANSCRIPTION_TRANSCRIBER_JOINED, { joined: false });
    }

    handleUserLeft(id, user);
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

    console.log('[STOOA] Auth Token', auth);

    if (isUserModerator) {
      makeModerator();
    }

    const roomName = getBackendSafeRoomName(rawRoomName);

    setRoomName(roomName);

    const connection = new JitsiMeetJS.JitsiConnection(
      null,
      auth ? auth.token : process.env.NEXT_PUBLIC_GUEST_TOKEN ?? null,
      connectionOptions(roomName)
    );

    setConnection(connection);

    connection.addEventListener(CONNECTION_ESTABLISHED, () =>
      _handleConnectionEstablished(roomName)
    );
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

    handleTrackRemoved(oldTrack);

    conference.replaceTrack(oldTrack, track);
  };

  const getParticipantById = id => getConference().getParticipantById(id);

  const getParticipantNameById = id => {
    const participant = getParticipantById(id);
    return participant ? participant.getDisplayName() : userName;
  };

  const leave = () => {
    console.log('[STOOA] Leave');

    if (isJoined) {
      setAsNotJoined();

      conference.leave();
      connection.disconnect();
    }
  };

  const startTranscriptionEvent = () => {
    console.log('[STOOA] Start transcription');
    conference.setLocalParticipantProperty('requestingTranscription', true);
  };

  const stopTranscriptionEvent = () => {
    console.log('[STOOA] Stop transcription');
    conference.setLocalParticipantProperty('requestingTranscription', false);
  };

  const setConferenceTranscriptionLanguage = language => {
    conference.setLocalParticipantProperty('transcription_language', language);
  };

  const setConferenceTranslationLanguage = language => {
    conference.setLocalParticipantProperty('translation_language', language);
  };

  const stopTranslation = () => {
    conference.setLocalParticipantProperty('translation_language', null);
  };

  const startScreenShareEvent = () => {
    conference.setLocalParticipantProperty('screenShare', 'true');
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

      joinUser(undefined, user);
    }
  };

  const sendLeaveEvent = () => {
    if (isJoined) {
      conference.setLocalParticipantProperty('joined', 'no');
      leaveUser();
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

    participantsIds.push(myUserId);

    return participantsIds;
  };

  const getLocalParticipant = () => {
    if (!isJoined) {
      return null;
    }

    return {
      id: myUserId,
      name: userName,
      twitter,
      linkedin,
      isModerator,
      isCurrentUser: true,
      joined:
        conference.isJoined() === null
          ? false
          : conference.getLocalParticipantProperty('joined') === 'yes',
      isMuted: isLocalParticipantMuted(myUserId, 'audio'),
      isVideoMuted: isLocalParticipantMuted(myUserId, 'video'),
      isJigasi: false
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
    getParticipantById,
    getParticipantCount,
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
    getLocalTracks,
    getParticipantsIds,
    startRecordingEvent,
    stopRecordingEvent,
    startTranscriptionEvent,
    stopTranscriptionEvent,
    setConferenceTranscriptionLanguage,
    setConferenceTranslationLanguage,
    stopTranslation
  };
};
