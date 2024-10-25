/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import {
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_USER_CONDUCT_VIOLATION,
  ROUTE_USER_NO_PARTICIPATING
} from '@/app.config';
import api from '@/lib/api';
import { useJitsi } from '@/lib/useJitsi';
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
  TRANSCRIPTION_TRANSCRIBER_JOINED,
  USER_KICKED,
  USER_MUST_LEAVE
} from '@/jitsi/Events';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { GET_FISHBOWL, INTRODUCE_FISHBOWL, NO_INTRO_RUN_FISHBOWL } from '@/lib/gql/Fishbowl';
import { isTimeLessThanNMinutes, isTimeUp } from '@/lib/helpers';
import { useStateValue } from '@/contexts/AppContext';
import useEventListener from '@/hooks/useEventListener';

import { toast } from 'react-toastify';
import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import { StooaContextValues } from '@/types/contexts/stooa-context';
import { Participant } from '@/types/participant';
import createGenericContext from '@/contexts/createGenericContext';
import { Fishbowl } from '@/types/api-platform';
import { pushEventDataLayer } from '@/lib/analytics';
import useVideoRecorder from '@/hooks/useVideoRecorder';
import { LOCALES } from '@/lib/supportedTranslationLanguages';
import { SupportedLanguageTag } from '@/types/transcriptions';
import { useConference, useSeats, useSharedTrack, useUser } from '@/jitsi';

const TEN_MINUTES = 10;
const ONE_MINUTE = 1;
const [useStooa, StooaContextProvider] = createGenericContext<StooaContextValues>();

const StooaProvider = ({
  fishbowl,
  isModerator,
  children
}: {
  fishbowl: Fishbowl;
  isModerator: boolean;
  children: JSX.Element[];
}) => {
  const router = useRouter();
  const { hasUserGaveFeedback, clearUser } = useUser();
  const { getIds } = useSeats();
  const { exitFullScreen } = useSharedTrack();
  const { initialInteraction, initializeJitsi, initializeConnection, unload, unloadKickedUser } =
    useJitsi();
  const {
    setConferenceTranscriptionLanguage,
    stopRecordingEvent,
    lockConference,
    joinPrivateConference,
    joinConference
  } = useConference();
  const { fid } = router.query;
  const { t, lang } = useTranslation('app');

  const useGaveFeedback = useMemo(() => hasUserGaveFeedback(fid as string), [fid]);

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
  const [feedbackAlert, setFeedbackAlert] = useState(false);
  const [gaveFeedback, setGaveFeedback] = useState(useGaveFeedback);
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isTranscriberJoined, setIsTranscriberJoined] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState<SupportedLanguageTag>(
    LOCALES[lang]
  );
  const [participantsActive, setParticipantsActive] = useState(() => {
    if (isModerator && fishbowl.isFishbowlNow) {
      return true;
    }
    return false;
  });
  const [selectedTranscriptionLanguage, setSelectedTranscriptionLanguage] = useState(LOCALES[lang]);

  const apiInterval = useRef<number>();
  const timeUpInterval = useRef<number>();

  const { data: fishbowlQuery } = useQuery(GET_FISHBOWL, {
    variables: { slug: fid },
    skip: !isModerator
  });

  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const [introduceFishbowl] = useMutation(INTRODUCE_FISHBOWL);
  const [{ fishbowlStarted, conferenceStatus, prejoin }, dispatch] = useStateValue();

  const sendStopRecordingEvent = () => {
    stopRecordingEvent();
    setIsRecording(false);
  };

  const closeToGigabyteLimitNotification = () => {
    toast(t('fishbowl:recording.closeToGiga'), {
      icon: '⚠️',
      toastId: 'close-to-giga',
      type: 'warning',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  const recorderOptions = {
    fileName: fishbowl.name || 'Fishbowl',
    downloadingMessage: t('fishbowl:recording.downloading'),
    slug: fishbowl.slug
  };

  const { startRecording: startRecordingVideoRecorder, stopRecording } = useVideoRecorder(
    recorderOptions,
    sendStopRecordingEvent,
    closeToGigabyteLimitNotification
  );

  const startRecording = () => {
    return startRecordingVideoRecorder().then(result => {
      if (result.status === 'success') setIsRecording(true);
      pushEventDataLayer({
        category: 'Recording',
        action: 'Start',
        label: fishbowl.slug
      });
      return result;
    });
  };

  const startFishbowl = () => {
    const slug = { variables: { input: { slug: fid } } };
    if (fishbowl.hasIntroduction) {
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
    return fishbowlPassword ?? '';
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
    if (fishbowl.isPrivate && fishbowl.plainPassword && isModerator) {
      lockConference(fishbowl.plainPassword);
    }
  });

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    if (fishbowl.isPrivate) {
      joinPrivateConference(isModerator ? fishbowl.plainPassword : fishbowlPassword);
    } else {
      joinConference();
    }
  });

  useEventListener(CONFERENCE_PASSWORD_REQUIRED, () => {
    if (fishbowl.isPrivate && !fishbowlPassword && !fishbowl.plainPassword) {
      toast(t('form:validation.unknownErrorInside'), {
        icon: '⚠️',
        toastId: 'error-inside',
        type: 'warning',
        position: 'bottom-center',
        autoClose: 5000
      });
      clearUser();
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
    setConferenceTranscriptionLanguage(LOCALES[fishbowl.locale]);

    if (!isModerator) return;

    startFishbowl();
  });

  useEventListener(NOTIFICATION, ({ detail: { type, seats, message } }) => {
    if (seats.includes(myUserId)) {
      const delay = type === USER_MUST_LEAVE ? 5000 : 0;
      const autoClose = type === USER_MUST_LEAVE ? 15000 : 0;
      setTimeout(() => {
        if (getIds().length === 5) {
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

    exitFullScreen();

    setIsSharing(false);
  });

  useEventListener(SCREEN_SHARE_CANCELED, () => {
    setIsSharing(false);
  });

  useEventListener(RECORDING_START, () => {
    setIsRecording(true);
  });

  useEventListener(RECORDING_STOP, () => {
    setIsRecording(false);
  });

  useEventListener(MODERATOR_LEFT, () => {
    sendStopRecordingEvent();
  });

  useEventListener(TRANSCRIPTION_TRANSCRIBER_JOINED, ({ detail: { joined } }) => {
    setIsTranscriberJoined(joined);
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
    if (isTimeUp(fishbowl.endDateTimeTz)) {
      clearInterval(timeUpInterval.current);
      setTimeStatus(ITimeStatus.TIME_UP);
    } else if (isTimeLessThanNMinutes(fishbowl.endDateTimeTz, ONE_MINUTE + 1)) {
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
    } else if (isTimeLessThanNMinutes(fishbowl.endDateTimeTz, TEN_MINUTES + 1)) {
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
    if (fishbowl.hasIntroduction) {
      return conferenceStatus === IConferenceStatus.INTRODUCTION;
    }
    return false;
  };

  const onIntroduction = conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator;

  useEffect(() => {
    if (fishbowlQuery) {
      const { bySlugQueryFishbowl: fishbowlData } = fishbowlQuery;
      setFishbowlPassword(fishbowlData.plainPassword);
    }
  }, [fishbowlQuery]);

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
        data: fishbowl,
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
        setIsRecording,
        feedbackAlert,
        setFeedbackAlert,
        gaveFeedback,
        setGaveFeedback,
        isTranscriptionEnabled,
        setIsTranscriptionEnabled,
        isTranslationEnabled,
        setIsTranslationEnabled,
        participantsActive,
        setParticipantsActive,
        isTranscriberJoined,
        setIsTranscriberJoined,
        selectedTranscriptionLanguage,
        setSelectedTranscriptionLanguage,
        translationLanguage,
        setTranslationLanguage
      }}
    >
      {children}
    </StooaContextProvider>
  );
};

export { StooaProvider, useStooa };
