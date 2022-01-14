/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { Fishbowl } from '@/types/api-platform';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  fishbowlData: Fishbowl;
  timeStatus: ITimeStatus;
  conferenceStatus: IConferenceStatus;
  isModerator: boolean;
}

export const Counter = ({ fishbowlData, timeStatus, conferenceStatus, isModerator }: Props) => {
  const getDateByStatus = () =>
    conferenceStatus === IConferenceStatus?.NOT_STARTED
      ? Date.parse(fishbowlData.startDateTimeTz)
      : Date.parse(fishbowlData.endDateTimeTz);

  const [completedTime, setCompletedTime] = useState<boolean>(false);
  const [timeToDisplay, setTimeToDisplay] = useState<string>('Loading...');
  const [intervalTimer, setIntervalTimer] = useState<number>();
  const [fishbowlDate, setfishbowlDate] = useState(getDateByStatus());

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
    console.log('--- Changed Conference Status ---');
    if (conferenceStatus === IConferenceStatus.RUNNING) {
      setCompletedTime(false);
    }

    setfishbowlDate(getDateByStatus());

    return () => clearInterval(intervalTimer);
  }, [conferenceStatus]);

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
  }, [fishbowlDate, completedTime, timeStatus]);

  const rendererCountdown = (): string => {
    const conferenceNotStarted = conferenceStatus === IConferenceStatus?.NOT_STARTED;
    let timeLeftText;

    const seconds = checkSecondsToDate(fishbowlDate);

    if (checkIfFinished(fishbowlDate) || seconds === 0) {
      clearInterval(intervalTimer);
    }

    const minutes: number = Math.floor((seconds / 60) % 60);
    const hours: number = Math.floor(seconds / 3600);

    console.log(hours, minutes);
    console.log(seconds);

    if (seconds === 0 && conferenceNotStarted) {
      timeLeftText = isModerator ? t('waitingHost') : t('waiting');
    } else if (seconds === 0 && timeStatus === ITimeStatus.TIME_UP) {
      timeLeftText = t('timesUp');
    } else if ((minutes === 1 && hours === 0) || timeStatus === ITimeStatus.LAST_MINUTE) {
      timeLeftText = t('lastMinute');
    } else if (minutes === 0 && hours === 0 && conferenceNotStarted) {
      const time = `1${t('form:fishbowl.minutes')}`;
      timeLeftText = t('timeToStart', { time });
    } else {
      const hoursText = t('form:fishbowl.hours');
      const minutesText = t('form:fishbowl.minutes');
      const time =
        hours > 0 && seconds >= 3600
          ? `${hours}${hoursText}:${minutes >= 10 ? minutes : `0${minutes}`}`
          : Math.floor(seconds / 60);
      timeLeftText = t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_other', {
        time: `${time}${minutesText}`
      });
    }

    return timeLeftText;
  };

  return <div>{timeToDisplay}</div>;
};
