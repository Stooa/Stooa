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
  const [completedTime, setCompletedTime] = useState<boolean>(false);
  const [timeToDisplay, setTimeToDisplay] = useState<string>('Loading...');
  const [intervalTimer, setIntervalTimer] = useState<number>();
  const [fishbowlDate, setfishbowlDate] = useState(() => {
    return conferenceStatus === IConferenceStatus?.NOT_STARTED
      ? Date.parse(fishbowlData.startDateTimeTz)
      : Date.parse(fishbowlData.endDateTimeTz);
  });

  const { t } = useTranslation('fishbowl');

  const calculateDuration = (currentDate: number, fishbowlDate: number): number => {
    const difference = (fishbowlDate - currentDate) / 1000;
    if (difference < 0) {
      return 0;
    }
    return Math.ceil(difference);
  };

  const checkIfFinished = (currentDate: number, dateToCompare: number): boolean => {
    return currentDate >= dateToCompare;
  };

  useEffect(() => {
    console.log('--- Changed Conference Status ---');
    if (conferenceStatus === IConferenceStatus.RUNNING) {
      setCompletedTime(false);
    }

    setfishbowlDate(() => {
      return conferenceStatus === IConferenceStatus?.NOT_STARTED
        ? Date.parse(fishbowlData.startDateTimeTz)
        : Date.parse(fishbowlData.endDateTimeTz);
    });

    return () => clearInterval(intervalTimer);
  }, [conferenceStatus]);

  useEffect(() => {
    const currentDate = Date.now();
    const isFinished = checkIfFinished(currentDate, fishbowlDate);

    if (!isFinished) {
      setIntervalTimer(value =>
        window.setInterval(() => {
          if (value) {
            clearInterval(intervalTimer);
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
    const currentDate = Date.now();
    let timeLeftText;

    const duration = calculateDuration(currentDate, fishbowlDate);

    if (checkIfFinished(currentDate, fishbowlDate) || duration === 0) {
      console.log('--- Time is up ---');
      clearInterval(intervalTimer);
    }

    const minutes: number = Math.floor(duration / 60) % 60,
      hours: number = Math.floor(duration / 3600);

    if (duration === 0 && conferenceNotStarted) {
      timeLeftText = isModerator ? t('waitingHost') : t('waiting');
    } else if (duration === 0 && timeStatus === ITimeStatus.TIME_UP) {
      timeLeftText = t('timesUp');
    } else if (timeStatus === ITimeStatus.TIME_UP) {
      timeLeftText = t('lastMinute');
    } else if (minutes === 0 && hours === 0) {
      const time = `1${t('form:fishbowl.minutes')}`;
      timeLeftText = t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_one', { time });
    } else {
      const hoursText = t('form:fishbowl.hours');
      const minutesText = t('form:fishbowl.minutes');
      const time = hours > 0 ? `${hours}${hoursText}:${minutes}` : Math.ceil(duration / 60);
      timeLeftText = t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_other', {
        time: `${time}${minutesText}`
      });
    }

    return timeLeftText;
  };

  return <div>{timeToDisplay}</div>;
};
