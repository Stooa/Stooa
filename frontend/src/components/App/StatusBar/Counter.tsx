/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useMemo, useState } from 'react';

import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import useTranslation from 'next-translate/useTranslation';
import LoadingDots from '@/components/Common/LoadingDots';
import { useStooa } from '@/contexts/StooaManager';

interface Props {
  prefishbowl?: boolean;
}

export const Counter = ({ prefishbowl = false, ...props }: Props) => {
  const { data: fishbowlData, isModerator, conferenceStatus, timeStatus } = useStooa();

  const getDateByStatus = () => {
    if (
      fishbowlData.isFishbowlNow &&
      conferenceStatus === IConferenceStatus?.NOT_STARTED &&
      isModerator
    ) {
      return Date.parse(fishbowlData.endDateTimeTz);
    }

    if (conferenceStatus === IConferenceStatus?.NOT_STARTED) {
      return Date.parse(fishbowlData.startDateTimeTz);
    }

    return Date.parse(fishbowlData.endDateTimeTz);
  };

  const [completedTime, setCompletedTime] = useState<boolean>(false);
  const [timeToDisplay, setTimeToDisplay] = useState<string>('Loading');
  const [intervalTimer, setIntervalTimer] = useState<number>();
  const [fishbowlDate, setFishbowlDate] = useState(getDateByStatus());

  const { t } = useTranslation('fishbowl');

  const checkSecondsToDate = (fishbowlDate: number): number => {
    const difference = (fishbowlDate - Date.now()) / 1000;
    if (difference <= 0) {
      return 0;
    }
    return Math.floor(difference);
  };

  const checkIfFinished = (dateToCompare: number): boolean => {
    return Date.now() >= dateToCompare;
  };

  useEffect(() => {
    if (conferenceStatus === IConferenceStatus.RUNNING) {
      setCompletedTime(false);
    }

    setFishbowlDate(getDateByStatus());

    return () => clearInterval(intervalTimer);
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const isFinished = checkIfFinished(fishbowlDate);

    if (!isFinished) {
      setIntervalTimer(intervalValue =>
        window.setInterval(() => {
          if (intervalValue) {
            clearInterval(intervalValue);
          }
          setTimeToDisplay(rendererCountdown());
        }, 1000)
      );
    } else {
      setCompletedTime(true);
      setTimeToDisplay(rendererCountdown());
    }

    return () => clearInterval(intervalTimer);
  }, [fishbowlDate, completedTime, timeStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFishbowlNowAndModerator = useMemo(
    () => fishbowlData.isFishbowlNow && isModerator,
    [fishbowlData.isFishbowlNow, isModerator]
  );

  const rendererCountdown = (): string => {
    const conferenceNotStarted = conferenceStatus === IConferenceStatus?.NOT_STARTED;

    const seconds = checkSecondsToDate(fishbowlDate);

    if (checkIfFinished(fishbowlDate) || seconds === 0) {
      clearInterval(intervalTimer);
    }

    const minutes: number = Math.floor((seconds / 60) % 60);
    const hours: number = Math.floor(seconds / 3600);

    if (seconds === 0 && conferenceNotStarted) {
      return isModerator ? t('waitingHost') : t('waiting');
    } else if (seconds === 0) {
      return t('timesUp');
    } else if ((minutes <= 1 && hours === 0) || timeStatus === ITimeStatus.LAST_MINUTE) {
      return t('lastMinute');
    } else if (minutes === 0 && hours === 0 && conferenceNotStarted) {
      const time = `1${t('form:fishbowl.minutes')}`;
      return t('timeToStart', { time });
    } else {
      const hoursText = t('form:fishbowl.hours');
      const minutesText = hours > 0 ? t('form:fishbowl.minutesShort') : t('form:fishbowl.minutes');

      const time =
        hours > 0 && seconds >= 3600
          ? `${hours}${hoursText}:${minutes >= 10 ? minutes : `0${minutes}`}`
          : Math.floor(seconds / 60);

      if (isFishbowlNowAndModerator && conferenceNotStarted) {
        return t('timeLeft_other', { time: `${time}${minutesText}` });
      } else {
        return t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_other', {
          time: `${time}${minutesText}`
        });
      }
    }
  };

  return (
    <span {...props} className="body-xs medium counter">
      {timeToDisplay}
      {prefishbowl && <LoadingDots />}
    </span>
  );
};
