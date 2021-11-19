/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext, createContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL_THANKYOU } from 'app.config';
import api from 'lib/api';
import { initialInteraction, initializeJitsi, initializeConnection, unload } from 'lib/jitsi';
import {
  CONFERENCE_START,
  NOTIFICATION,
  NOTIFICATION_CLOSE,
  USER_MUST_LEAVE
} from '@/jitsi/Events';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { INTRODUCE_FISHBOWL } from 'lib/gql/Fishbowl';
import { isTimeLessThanNMinutes, isTimeUp } from 'lib/helpers';
import { useStateValue } from 'contexts/AppContext';
import useEventListener from 'hooks/useEventListener';
import useToasts from 'hooks/useToasts';

const TEN_MINUTES = 10;
const ONE_MINUTE = 1;

const StooaContext = createContext(undefined);

let initJitsi = false;
let initConnection = false;

const StooaProvider = ({ data, isModerator, children }) => {
  const [timeStatus, setTimeStatus] = useState<ITimeStatus>(ITimeStatus.DEFAULT);
  const [myUserId, setMyUserId] = useState(null);
  const [apiInterval, setApiInterval] = useState<number>(null);
  const [timeUpInterval, setTimeUpInterval] = useState<number>(null);
  const [conferenceReady, setConferenceReady] = useState(false);
  const { addToast, clearDelayed } = useToasts();
  const { t, lang } = useTranslation('app');
  const { locale } = useRouter();

  const [introduceFishbowl] = useMutation(INTRODUCE_FISHBOWL);
  const [{ fishbowlStarted, conferenceStatus, prejoin }, dispatch] = useStateValue();
  const router = useRouter();
  const { fid } = router.query;

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    setMyUserId(myUserId);
    setConferenceReady(true);

    if (!isModerator) return;

    try {
      introduceFishbowl({
        variables: {
          input: {
            slug: fid
          }
        }
      });
    } catch (error) {
      console.error(`[STOOA] Error introduction: ${error}`);
    }
  });

  useEventListener(NOTIFICATION, ({ detail: { type, seats, message } }) => {
    if (seats.includes(myUserId)) {
      const delay = type === USER_MUST_LEAVE ? 8000 : 0;
      const autoclose = type === USER_MUST_LEAVE ? 15000 : 0;
      addToast({ type, message }, delay, autoclose);
    }
  });

  useEventListener(NOTIFICATION_CLOSE, ({ detail: { type } }) => {
    clearDelayed(type);
  });

  const checkApIConferenceStatus = () => {
    api
      .get(`${lang}/fishbowl-status/${fid}`, {
        headers: { 'Accept-Language': locale }
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
      window.clearInterval(timeUpInterval);
      setTimeStatus(ITimeStatus.TIME_UP);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, ONE_MINUTE)) {
      setTimeStatus(ITimeStatus.TIME_UP);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, ONE_MINUTE + 1)) {
      if (conferenceStatus === IConferenceStatus.RUNNING) {
        const message = t('notification.oneMinuteLeft');
        addToast({ type: ITimeStatus.LAST_MINUTE, message }, 5000);
      }
      setTimeStatus(ITimeStatus.LAST_MINUTE);
    } else if (isTimeLessThanNMinutes(data.endDateTimeTz, TEN_MINUTES + 1)) {
      if (conferenceStatus === IConferenceStatus.RUNNING) {
        const message = t('notification.tenMinutesLeft');
        addToast({ type: ITimeStatus.ENDING, message }, 3000);
      }
      setTimeStatus(ITimeStatus.ENDING);
    }
  };

  useEffect(() => {
    if (!initJitsi) {
      initializeJitsi();

      initJitsi = true;
    }

    if (prejoin) {
      return;
    }

    if (conferenceStatus === IConferenceStatus.FINISHED) {
      unload();

      const route = `${ROUTE_FISHBOWL_THANKYOU}/${fid}`;
      router.push(route, route, { locale: lang });
    }

    if (
      !initConnection &&
      ((isModerator && fishbowlStarted) ||
        (!conferenceReady && conferenceStatus !== IConferenceStatus.NOT_STARTED))
    ) {
      initializeConnection(fid, isModerator);

      window.addEventListener('beforeunload', unload);
      window.addEventListener('unload', unload);
      window.addEventListener('mousedown', initialInteraction);
      window.addEventListener('keydown', initialInteraction);

      initConnection = true;
    }

    return () => {
      window.removeEventListener('beforeunload', unload);
      window.removeEventListener('unload', unload);
      window.removeEventListener('mousedown', initialInteraction);
      window.removeEventListener('keydown', initialInteraction);
    };
  }, [fishbowlStarted, conferenceReady, conferenceStatus, prejoin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkIsTimeUp();

    setTimeUpInterval(window.setInterval(checkIsTimeUp, 1500));
    setApiInterval(window.setInterval(checkApIConferenceStatus, 6000));

    return () => {
      window.clearInterval(timeUpInterval);
      window.clearInterval(apiInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onIntroduction = conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator;

  return (
    <StooaContext.Provider
      value={{
        conferenceReady,
        conferenceStatus,
        data,
        isModerator,
        onIntroduction,
        timeStatus
      }}>
      {children}
    </StooaContext.Provider>
  );
};

const useStooa = () => useContext(StooaContext);

export { StooaProvider, useStooa };
