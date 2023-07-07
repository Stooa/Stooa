/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { isTimeLessThanNMinutes, isTimeUp } from '@/lib/helpers';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';
import { Fishbowl } from '@/types/api-platform';

const TEN_MINUTES = 10;
const ONE_MINUTE = 1;

const useTimeStatus = (fishbowl: Fishbowl, conferenceStatus: IConferenceStatus) => {
  const { t } = useTranslation('app');
  const [timeStatus, setTimeStatus] = useState<ITimeStatus>(ITimeStatus.DEFAULT);
  const [tenMinuteToastSent, seTenMinuteToastSent] = useState(false);
  const [lastMinuteToastSent, setLastMinuteToastSent] = useState(false);
  const timeUpInterval = useRef<number>();

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

  useEffect(() => {
    checkIsTimeUp();

    timeUpInterval.current = window.setInterval(checkIsTimeUp, 1000);

    return () => {
      clearInterval(timeUpInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conferenceStatus]);

  useEffect(() => {
    clearInterval(timeUpInterval.current);

    timeUpInterval.current = window.setInterval(checkIsTimeUp, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenMinuteToastSent, lastMinuteToastSent]);

  return { timeStatus };
};

export default useTimeStatus;
