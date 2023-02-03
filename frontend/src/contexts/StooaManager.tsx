/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import userRepository from '@/jitsi/User';

import {
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_USER_CONDUCT_VIOLATION,
  ROUTE_USER_NO_PARTICIPATING
} from '@/app.config';
import api from '@/lib/api';
import {
  initialInteraction,
  initializeJitsi,
  initializeConnection,
  unload,
  unloadKickedUser
} from '@/lib/jitsi';
import {
  CONFERENCE_IS_LOCKABLE,
  CONFERENCE_PASSWORD_REQUIRED,
  CONFERENCE_START,
  CONNECTION_ESTABLISHED_FINISHED,
  MODERATOR_LEFT,
  NOTIFICATION,
  RECORDING_START,
  RECORDING_STOP,
  SCREEN_SHARE_CANCELED,
  SCREEN_SHARE_START,
  SCREEN_SHARE_STOP,
  USER_KICKED,
  USER_MUST_LEAVE
} from '@/jitsi/Events';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { INTRODUCE_FISHBOWL, NO_INTRO_RUN_FISHBOWL } from '@/lib/gql/Fishbowl';
import { isTimeLessThanNMinutes, isTimeUp } from '@/lib/helpers';
import { useStateValue } from '@/contexts/AppContext';
import useEventListener from '@/hooks/useEventListener';
import seatsRepository from '@/jitsi/Seats';

import { toast } from 'react-toastify';
import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import { StooaContextValues } from '@/types/contexts/stooa-context';
import { Participant } from '@/types/participant';
import createGenericContext from '@/contexts/createGenericContext';
import Conference from '@/jitsi/Conference';
import { Fishbowl } from '@/types/api-platform';
import { pushEventDataLayer } from '@/lib/analytics';
import SharedTrack from '@/jitsi/SharedTrack';
import useVideoRecorder from '@/hooks/useVideoRecorder';

const TEN_MINUTES = 10;
const ONE_MINUTE = 1;
const [useStooa, StooaContextProvider] = createGenericContext<StooaContextValues>();

const StooaProvider = ({
  data,
  isModerator,
  children
}: {
  data: Fishbowl;
  isModerator: boolean;
  children: JSX.Element[];
}) => {
  const [timeStatus, setTimeStatus] = useState<ITimeStatus>(ITimeStatus.DEFAULT);
  const [myUserId, setMyUserId] = useState(null);
  const [initConnection, setInitConnection] = useState(false);
  const [conferenceReady, setConferenceReady] = useState(false);
  const [tenMinuteToastSent, seTenMinuteToastSent] = useState(false);
  const [lastMinuteToastSent, setLastMinuteToastSent] = useState(false);
  const [participantToKick, setParticipantToKick] = useState<Participant>();
  const [fishbowlPassword, setFishbowlPassword] = useState<string>();
  const [isSharing, setIsSharing] = useState(false);
  const [clientRunning, setClientRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { t, lang } = useTranslation('app');

  const apiInterval = useRef<number>();
  const timeUpInterval = useRef<number>();
  const recordingStart = useRef<Date>();

  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const [introduceFishbowl] = useMutation(INTRODUCE_FISHBOWL);
  const [{ fishbowlStarted, conferenceStatus, prejoin }, dispatch] = useStateValue();
  const router = useRouter();
  const { fid } = router.query;

  const sendStopRecordingEvent = () => {
    Conference.stopRecordingEvent();
    setIsRecording(false);
  };

  const { startRecording: startRecordingVideoRecorder, stopRecording: stopRecordingFromApp } =
    useVideoRecorder(sendStopRecordingEvent);

  const startRecording = () => {
    pushEventDataLayer({
      category: 'Recording',
      action: 'Start',
      label: data.slug
    });
    return startRecordingVideoRecorder().then(result => {
      if (result.status === 'success') setIsRecording(true);
      return result;
    });
  };

  const stopRecording = () => {
    pushEventDataLayer({
      category: 'Recording',
      action: 'Stop',
      label: data.slug
    });

    if (recordingStart.current) {
      const diff = new Date().getTime() - recordingStart.current.getTime();
      console.log('-----> [STOOA] Recording duration: ', diff);
      pushEventDataLayer({
        category: 'Recording',
        action: 'Duration',
        label: diff.toString()
      });
    }

    return stopRecordingFromApp(data.name, t('fishbowl:recording.downloading'));
  };

  const startFishbowl = () => {
    const slug = { variables: { input: { slug: fid } } };
    if (data.hasIntroduction) {
      try {
        introduceFishbowl(slug);
      } catch (error) {
        console.error(`[STOOA] Error introduction: ${error}`);
      }
    } else {
      try {
        runWithoutIntroFishbowl(slug);
      } catch (error) {
        console.error(`[STOOA] Error introduction: ${error}`);
      }
    }
  };

  const getPassword = (): string => {
    if (isModerator) {
      return data.plainPassword as string;
    } else {
      return fishbowlPassword ?? '';
    }
  };

  useEventListener(USER_KICKED, async ({ detail: { reason, participant } }) => {
    if (reason !== REASON_NO_PARTICIPATING && reason !== REASON_CONDUCT_VIOLATION) {
      return;
    }

    await unloadKickedUser(participant);

    const pathName =
      reason === REASON_CONDUCT_VIOLATION
        ? ROUTE_USER_CONDUCT_VIOLATION
        : ROUTE_USER_NO_PARTICIPATING;

    const url = {
      pathname: pathName,
      ...(reason === REASON_NO_PARTICIPATING && { query: { fid: fid } })
    };

    router.push(url, url, { locale: lang });
  });

  useEventListener(CONFERENCE_IS_LOCKABLE, () => {
    if (data.isPrivate && data.plainPassword && isModerator) {
      Conference.lockConference(data.plainPassword);
    }
  });

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    if (data.isPrivate) {
      Conference.joinPrivateConference(isModerator ? data.plainPassword : fishbowlPassword);
    } else {
      Conference.joinConference();
    }
  });

  useEventListener(CONFERENCE_PASSWORD_REQUIRED, () => {
    if (data.isPrivate && !fishbowlPassword && !data.plainPassword) {
      toast(t('form:validation.unknownErrorInside'), {
        icon: '⚠️',
        toastId: 'error-inside',
        type: 'warning',
        position: 'bottom-center',
        autoClose: 5000
      });
      userRepository.clearUser();
      setInitConnection(false);
      setFishbowlPassword(undefined);
      dispatch({
        type: 'PREJOIN_RESET',
        prejoin: true
      });
    }
  });

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    setMyUserId(myUserId);
    setConferenceReady(true);

    if (!isModerator) return;

    startFishbowl();
  });

  useEventListener(NOTIFICATION, ({ detail: { type, seats, message } }) => {
    if (seats.includes(myUserId)) {
      const delay = type === USER_MUST_LEAVE ? 5000 : 0;
      const autoClose = type === USER_MUST_LEAVE ? 15000 : 0;
      setTimeout(() => {
        if (seatsRepository.getIds().length === 5) {
          toast(t(message), {
            icon: '⚠️',
            toastId: 'must-leave',
            type: 'warning',
            position: 'bottom-center',
            autoClose
          });
        }
      }, delay);
    }
  });

  useEventListener(SCREEN_SHARE_START, () => {
    setIsSharing(true);
  });

  useEventListener(SCREEN_SHARE_STOP, ({ detail: { location } }) => {
    if (isModerator) {
      pushEventDataLayer({
        action: location === 'app' ? 'stooa_stop_share' : 'navigator_stop_share',
        category: 'Sharescreen',
        label: window.location.href
      });
    }

    SharedTrack.exitFullScreen();

    setIsSharing(false);
  });

  useEventListener(SCREEN_SHARE_CANCELED, () => {
    setIsSharing(false);
  });

  useEventListener(RECORDING_START, () => {
    recordingStart.current = new Date();
    setIsRecording(true);
  });

  useEventListener(RECORDING_STOP, () => {
    setIsRecording(false);
  });

  useEventListener(MODERATOR_LEFT, () => {
    sendStopRecordingEvent();
  });

  const checkApIConferenceStatus = () => {
    api
      .get(`${lang}/fishbowl-status/${fid}`, {
        headers: { 'Accept-Language': lang }
      })
      .then(({ data: { status } }) => {
        dispatch({
          type: 'FISHBOWL_STATUS',
          conferenceStatus: status
        });
      })
      .catch(error => {
        console.log('[STOOA] ', error);
      });
  };

  const checkIsTimeUp = () => {
    if (isTimeUp(data.endDateTimeTz)) {
      clearInterval(timeUpInterval.current);
      setTimeStatus(ITimeStatus.TIME_UP);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, ONE_MINUTE + 1)) {
      if (conferenceStatus === IConferenceStatus.RUNNING && !lastMinuteToastSent) {
        const message = t('notification.oneMinuteLeft');
        toast(message, {
          icon: '⏳',
          type: 'error',
          toastId: 'one-minute',
          position: 'bottom-center',
          delay: 5000,
          autoClose: 10000
        });
        setLastMinuteToastSent(true);
      }
      setTimeStatus(ITimeStatus.LAST_MINUTE);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, TEN_MINUTES + 1)) {
      if (conferenceStatus === IConferenceStatus.RUNNING && !tenMinuteToastSent) {
        const message = t('notification.tenMinutesLeft');
        toast(message, {
          icon: '⏳',
          type: 'warning',
          toastId: 'ten-minute',
          position: 'bottom-center',
          delay: 3000,
          autoClose: 10000
        });
        seTenMinuteToastSent(true);
      }
      setTimeStatus(ITimeStatus.ENDING);
    }
  };

  const isConferenceIntroducing = (): boolean => {
    if (data.hasIntroduction) {
      return conferenceStatus === IConferenceStatus.INTRODUCTION;
    }
    return false;
  };

  const onIntroduction = conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator;

  useEffect(() => {
    if (isModerator && isConferenceIntroducing()) {
      pushEventDataLayer({
        action: 'activate',
        category: 'Sharescreen',
        label: window.location.href
      });
    }
  }, [conferenceStatus]);

  useEffect(() => {
    if (
      !prejoin &&
      !initConnection &&
      ((isModerator && fishbowlStarted) ||
        (!conferenceReady &&
          (isConferenceIntroducing() || conferenceStatus === IConferenceStatus.RUNNING)))
    ) {
      setTimeout(() => {
        initializeConnection(fid, isModerator);
      }, 700);

      window.addEventListener('mousedown', initialInteraction);
      window.addEventListener('keydown', initialInteraction);

      setInitConnection(true);
    }

    return () => {
      window.removeEventListener('mousedown', initialInteraction);
      window.removeEventListener('keydown', initialInteraction);
    };
  }, [fishbowlStarted, conferenceReady, conferenceStatus, prejoin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initializeJitsi();
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', unload);
    window.addEventListener('unload', unload);

    return () => {
      window.removeEventListener('beforeunload', unload);
      window.removeEventListener('unload', unload);
    };
  }, []);

  useEffect(() => {
    if (conferenceStatus === IConferenceStatus.FINISHED) {
      unload().then(function () {
        const route = `${ROUTE_FISHBOWL_THANKYOU}/${fid}`;
        router.push(route, route, { locale: lang });
      });
    }
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkIsTimeUp();

    timeUpInterval.current = window.setInterval(checkIsTimeUp, 1000);
    apiInterval.current = window.setInterval(checkApIConferenceStatus, 6000);

    return () => {
      clearInterval(timeUpInterval.current);
      clearInterval(apiInterval.current);
    };
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearInterval(timeUpInterval.current);
    timeUpInterval.current = window.setInterval(checkIsTimeUp, 1000);
  }, [tenMinuteToastSent, lastMinuteToastSent]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StooaContextProvider
      value={{
        conferenceReady,
        conferenceStatus,
        data,
        isModerator,
        onIntroduction,
        timeStatus,
        participantToKick,
        setParticipantToKick,
        getPassword,
        setFishbowlPassword,
        isSharing,
        setIsSharing,
        clientRunning,
        setClientRunning,
        startRecording,
        stopRecording,
        isRecording,
        setIsRecording
      }}
    >
      {children}
    </StooaContextProvider>
  );
};

export { StooaProvider, useStooa };
