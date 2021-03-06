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
import { CONFERENCE_START, NOTIFICATION, USER_KICKED, USER_MUST_LEAVE } from '@/jitsi/Events';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { INTRODUCE_FISHBOWL, NO_INTRO_RUN_FISHBOWL } from '@/lib/gql/Fishbowl';
import { isTimeLessThanNMinutes, isTimeUp } from '@/lib/helpers';
import { useStateValue } from '@/contexts/AppContext';
import useEventListener from '@/hooks/useEventListener';
import seatsRepository from '@/jitsi/Seats';

import { toast } from 'react-toastify';
import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import { StooaContextValues } from '@/types/stooa-context';
import { Participant } from '@/types/participant';
import { pushEventDataLayer } from '@/lib/analytics';
import { getOnBoardingCookie } from '@/lib/auth';
import createGenericContext from '@/contexts/createGenericContext';

const TEN_MINUTES = 10;
const ONE_MINUTE = 1;
const [useStooa, StooaContextProvider] = createGenericContext<StooaContextValues>();

const StooaProvider = ({ data, isModerator, children }) => {
  const [timeStatus, setTimeStatus] = useState<ITimeStatus>(ITimeStatus.DEFAULT);
  const [myUserId, setMyUserId] = useState(null);
  const [initConnection, setInitConnection] = useState(false);
  const [conferenceReady, setConferenceReady] = useState(false);
  const [tenMinuteToastSent, seTenMinuteToastSent] = useState(false);
  const [lastMinuteToastSent, setLastMinuteToastSent] = useState(false);
  const [participantToKick, setParticipantToKick] = useState<Participant>();
  const [showOnBoardingModal, setShowOnBoardingModal] = useState(false);
  const [activeOnBoardingTooltip, setActiveOnBoardingTooltip] = useState(false);
  const [onBoardingTooltipSeen, setOnBoardingTooltipSeen] = useState(false);
  const [showOnBoardingTour, setShowOnBoardingTour] = useState(false);

  const { t, lang } = useTranslation('app');

  const apiInterval = useRef<number>();
  const timeUpInterval = useRef<number>();

  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const [introduceFishbowl] = useMutation(INTRODUCE_FISHBOWL);
  const [{ fishbowlStarted, conferenceStatus, prejoin }, dispatch] = useStateValue();
  const router = useRouter();
  const { fid } = router.query;

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
            icon: '??????',
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

  const checkIsTimeUp = () => {
    if (isTimeUp(data.endDateTimeTz)) {
      clearInterval(timeUpInterval.current);
      setTimeStatus(ITimeStatus.TIME_UP);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, ONE_MINUTE + 1)) {
      if (conferenceStatus === IConferenceStatus.RUNNING && !lastMinuteToastSent) {
        const message = t('notification.oneMinuteLeft');
        toast(message, {
          icon: '???',
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
          icon: '???',
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
    return data.hasIntroduction && conferenceStatus === IConferenceStatus.INTRODUCTION;
  };

  const onIntroduction = conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator;

  const toggleOnBoarding = (location: string) => {
    pushEventDataLayer({
      action: showOnBoardingModal ? 'OnBoarding close' : 'OnBoarding open',
      category: location,
      label: window.location.href
    });

    setShowOnBoardingModal(!showOnBoardingModal);
  };

  const shouldShowOnboardingModal = () => {
    const cookie = getOnBoardingCookie(isModerator);

    if (!cookie && conferenceStatus === IConferenceStatus.NOT_STARTED && isModerator) {
      setShowOnBoardingModal(true);
      setOnBoardingTooltipSeen(false);
    }
  };

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

  useEffect(() => {
    shouldShowOnboardingModal();
  }, []);

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
        showOnBoardingModal,
        setShowOnBoardingModal,
        toggleOnBoarding,
        activeOnBoardingTooltip,
        setActiveOnBoardingTooltip,
        onBoardingTooltipSeen,
        setOnBoardingTooltipSeen,
        showOnBoardingTour,
        setShowOnBoardingTour
      }}
    >
      {children}
    </StooaContextProvider>
  );
};

export { StooaProvider, useStooa };
