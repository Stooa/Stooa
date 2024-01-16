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
  NOTIFICATION,
  USER_KICKED,
  USER_MUST_LEAVE
} from '@/jitsi/Events';
import { IConferenceStatus } from '@/jitsi/Status';
import { GET_FISHBOWL, INTRODUCE_FISHBOWL, NO_INTRO_RUN_FISHBOWL } from '@/lib/gql/Fishbowl';
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
import { useConference, useSeats, useUser } from '@/jitsi';
import useTimeStatus from '@/hooks/useTimeStatus';
import useScreenShare from '@/hooks/useScreenShare';

const [useStooa, StooaContextProvider] = createGenericContext<StooaContextValues>();

const StooaProvider = ({
  fishbowl,
  isModerator,
  children
}: {
  fishbowl: Fishbowl;
  isModerator: boolean;
  children: JSX.Element[] | JSX.Element;
}) => {
  const router = useRouter();
  const { hasUserGaveFeedback, clearUser } = useUser();
  const { getIds } = useSeats();
  const { initialInteraction, initializeConnection, unload, unloadKickedUser } = useJitsi();
  const {
    setConferenceTranscriptionLanguage,
    lockConference,
    joinPrivateConference,
    joinConference
  } = useConference();
  const { fid } = router.query;
  const { t, lang } = useTranslation('app');

  const useGaveFeedback = useMemo(() => hasUserGaveFeedback(fid as string), [fid]);

  const [myUserId, setMyUserId] = useState(null);
  const [initConnection, setInitConnection] = useState(false);
  const [conferenceReady, setConferenceReady] = useState(false);
  const [participantToKick, setParticipantToKick] = useState<Participant>();
  const [fishbowlPassword, setFishbowlPassword] = useState<string>();
  const [clientRunning, setClientRunning] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState(false);
  const [gaveFeedback, setGaveFeedback] = useState(useGaveFeedback);

  const [participantsActive, setParticipantsActive] = useState(() => {
    if (isModerator && fishbowl.isFishbowlNow) {
      return true;
    }
    return false;
  });

  const apiInterval = useRef<number>();

  const { data: fishbowlQuery } = useQuery(GET_FISHBOWL, {
    variables: { slug: fid },
    skip: !isModerator
  });

  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const [introduceFishbowl] = useMutation(INTRODUCE_FISHBOWL);
  const [{ fishbowlStarted, conferenceStatus, prejoin }, dispatch] = useStateValue();
  const { timeStatus } = useTimeStatus(fishbowlQuery, conferenceStatus);
  const { isSharing, share, stopShare } = useScreenShare(isModerator);

  const { isRecording, setIsRecording, startRecording, stopRecording } = useVideoRecorder(
    fishbowlQuery.name || 'Fishbowl',
    t('fishbowl:recording.downloading'),
    t('fishbowl:recording.closeToGiga'),
    fishbowlQuery.slug
  );

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
    if (conferenceStatus === IConferenceStatus.FINISHED) {
      unload().then(function () {
        const route = `${ROUTE_FISHBOWL_THANKYOU}/${fid}`;
        router.push(route, route, { locale: lang });
      });
    }
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    apiInterval.current = window.setInterval(checkApIConferenceStatus, 6000);

    return () => {
      clearInterval(apiInterval.current);
    };
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

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
        share,
        stopShare,
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
        participantsActive,
        setParticipantsActive
      }}
    >
      {children}
    </StooaContextProvider>
  );
};

export { StooaProvider, useStooa };
