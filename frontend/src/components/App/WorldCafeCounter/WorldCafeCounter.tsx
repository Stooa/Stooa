/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

import { WorldCafeStatus } from '@/jitsi/Status';
import useTranslation from 'next-translate/useTranslation';
import LoadingDots from '@/components/Common/LoadingDots';

interface Props {
  preEvent?: boolean;
  startDateTimeTz: string;
  isModerator: boolean;
  eventStatus: WorldCafeStatus;
}

const WorldCafeCounter = ({
  preEvent = false,
  startDateTimeTz,
  isModerator,
  eventStatus,
  ...props
}: Props) => {
  const [completedTime, setCompletedTime] = useState<boolean>(false);
  const [timeToDisplay, setTimeToDisplay] = useState<string>('Loading');
  const [intervalTimer, setIntervalTimer] = useState<number>();

  const eventDate = Date.parse(startDateTimeTz);

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
    const isFinished = checkIfFinished(eventDate);

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
  }, [completedTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const rendererCountdown = (): string => {
    const conferenceNotStarted = eventStatus === WorldCafeStatus?.NOT_STARTED;

    const seconds = checkSecondsToDate(eventDate);

    if (checkIfFinished(eventDate) || seconds === 0) {
      clearInterval(intervalTimer);
    }

    const minutes: number = Math.floor((seconds / 60) % 60);
    const hours: number = Math.floor(seconds / 3600);

    if (seconds === 0 && conferenceNotStarted) {
      return isModerator ? t('world-cafe:waitingHost') : t('world-cafe:eeewaiting');
    } else if (minutes === 0 && hours === 0 && conferenceNotStarted) {
      const time = `1 ${t('form:fishbowl.minutes')}`;
      return t('timeToStart', { time });
    } else {
      const hoursText = t('form:fishbowl.hours');
      const minutesText = hours > 0 ? t('form:fishbowl.minutesShort') : t('form:fishbowl.minutes');

      const time =
        hours > 0 && seconds >= 3600
          ? `${hours}${hoursText}:${minutes >= 10 ? minutes : `0${minutes}`}`
          : Math.floor(seconds / 60);

      return t('timeToStart', { time: `${time} ${minutesText}` });
    }
  };

  return (
    <span {...props} className="body-xs medium counter">
      {timeToDisplay}
      {preEvent && <LoadingDots />}
    </span>
  );
};

export default WorldCafeCounter;
