/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// import { useState } from 'react';
import JitsiConnection from 'lib-jitsi-meet/types/hand-crafted/JitsiConnection';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';
import { useJitsiStore } from '@/stores';
import { getAuthToken } from '@/user/auth';
import { connectionOptions, initOptions, roomOptions } from '@/jitsi/Globals';
import { getBackendSafeRoomName } from '@/lib/helpers';
import Conference from '@/jitsi/Conference';
import {
  handleConnectionDisconnected,
  handleConnectionFailed,
  handleConnectionEstablished,
  handleConferenceError,
  handleConferenceFailed,
  handleDominantSpeakerChanged,
  handleUserRoleChanged,
  handlePasswordRequired,
  handlePasswordNotSupported,
  handleMessageReceived,
  handleCommandJoin,
  handleCommandLeave,
  handleParticipantConnectionStatusChanged,
  handleParticipantPropertyChanged,
  handleConferenceJoin,
  handlePermissionChanged,
  handlePermissionIsShown,
  handleUserMediaSlowPromiseTimeout
} from '@/lib/handlers';
import useEventListener from '@/hooks/useEventListener';
import tracksRepository from '@/jitsi/Tracks';
import userRepository from '@/jitsi/User';

type UseJitsi = {
  initializeConnection: (rawRoomName: string, isUserModerator: boolean) => Promise<void>;
  initializeJitsi: () => void;
};

export const JITSI_CONNECTION_ESTABLISHED = 'JITSI_CONNECTION_ESTABLISHED';
export const JITSI_USER_JOIN = 'JITSI_USER_JOIN';
export const JITSI_USER_LEAVE = 'JITSI_USER_LEAVE';

const attachConferenceEvents = (conference: JitsiConference) => {
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
        MESSAGE_RECEIVED
      }
    },
    errors: {
      conference: { PASSWORD_REQUIRED, PASSWORD_NOT_SUPPORTED }
    }
  } = JitsiMeetJS;

  conference.on(PARTICIPANT_CONN_STATUS_CHANGED, handleParticipantConnectionStatusChanged);
  conference.on(PARTICIPANT_PROPERTY_CHANGED, handleParticipantPropertyChanged);
  conference.on(TRACK_ADDED, tracksRepository.handleTrackAdded);
  conference.on(TRACK_REMOVED, tracksRepository.handleTrackRemoved);
  conference.on(TRACK_MUTE_CHANGED, tracksRepository.handleTrackMuteChanged);
  conference.on(USER_JOINED, userRepository.handleUserJoin);
  conference.on(USER_LEFT, userRepository.handleUserLeft);
  conference.on(KICKED, userRepository.handleUserKicked);
  conference.on(CONFERENCE_JOINED, () => handleConferenceJoin(conference));
  conference.on(CONFERENCE_FAILED, handleConferenceFailed);
  conference.on(CONFERENCE_ERROR, handleConferenceError);
  conference.on(DOMINANT_SPEAKER_CHANGED, handleDominantSpeakerChanged);
  conference.on(USER_ROLE_CHANGED, () => handleUserRoleChanged(conference));
  conference.on(MESSAGE_RECEIVED, handleMessageReceived);
  conference.on(PASSWORD_REQUIRED, handlePasswordRequired);
  conference.on(PASSWORD_NOT_SUPPORTED, handlePasswordNotSupported);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  conference.addCommandListener('join', values => handleCommandJoin(conference, values));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  conference.addCommandListener('leave', values => handleCommandLeave(conference, values));
};

const attachConnectionEvents = (connection: JitsiConnection) => {
  const {
    events: {
      connection: { CONNECTION_ESTABLISHED, CONNECTION_FAILED, CONNECTION_DISCONNECTED }
    }
  } = JitsiMeetJS;

  connection.addEventListener(CONNECTION_ESTABLISHED, handleConnectionEstablished.bind(connection));
  connection.addEventListener(CONNECTION_FAILED, handleConnectionFailed.bind(connection));
  connection.addEventListener(
    CONNECTION_DISCONNECTED,
    handleConnectionDisconnected.bind(connection)
  );
};

export const useJitsi = (): UseJitsi => {
  const { connection, roomName, setConnection, setConference, setRoomName } = useJitsiStore();
  // const [isModerator, setIsModerator] = useState(false);

  const initializeConference = async (roomName: string): Promise<void> => {
    if (!connection) return;

    const conference = connection.initJitsiConference(roomName, roomOptions);

    setConference(conference);
    attachConferenceEvents(conference);
  };

  const initializeConnection = async (
    rawRoomName: string,
    isUserModerator: boolean
  ): Promise<void> => {
    const auth = await getAuthToken(true, rawRoomName);

    console.log(isUserModerator);
    // setIsModerator(isUserModerator);

    Conference.setUsername(auth ? auth.user : null);

    const roomName = getBackendSafeRoomName(rawRoomName);

    setRoomName(roomName);

    const connection = new JitsiMeetJS.JitsiConnection(
      null,
      auth ? auth.token : process.env.NEXT_PUBLIC_GUEST_TOKEN ?? null,
      connectionOptions(roomName)
    );

    setConnection(connection);
    attachConnectionEvents(connection);

    connection.connect();
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

    JitsiMeetJS.mediaDevices.addEventListener(PERMISSION_PROMPT_IS_SHOWN, handlePermissionIsShown);
    JitsiMeetJS.mediaDevices.addEventListener(
      USER_MEDIA_SLOW_PROMISE_TIMEOUT,
      handleUserMediaSlowPromiseTimeout
    );
    JitsiMeetJS.mediaDevices.addEventListener(PERMISSIONS_CHANGED, handlePermissionChanged);
  };

  useEventListener(JITSI_CONNECTION_ESTABLISHED, () => {
    if (!roomName) return;

    initializeConference(roomName);
  });

  return { initializeConnection, initializeJitsi };
};
