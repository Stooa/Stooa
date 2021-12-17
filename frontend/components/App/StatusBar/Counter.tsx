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
  const [timeToDisplay, setTimeToDisplay] = useState<string>();
  const [fishbowlDate, setfishbowlDate] = useState(() => {
    return conferenceStatus === IConferenceStatus?.NOT_STARTED
      ? Date.parse(fishbowlData.startDateTimeTz)
      : Date.parse(fishbowlData.endDateTimeTz);
  });
  const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timeout>();

  const { t } = useTranslation('fishbowl');

  const checkSecondsToDate = (currentDate: number, fishbowlDate: number): number => {
    return Math.ceil(Math.abs((fishbowlDate - currentDate) / 1000));
  };

  const checkIfFinished = (currentDate: number, dateToCompare: number): boolean => {
    return currentDate >= dateToCompare;
  };

  useEffect(() => {
    console.log('esto no va');
    setfishbowlDate(() => {
      return conferenceStatus === IConferenceStatus?.NOT_STARTED
        ? Date.parse(fishbowlData.startDateTimeTz)
        : Date.parse(fishbowlData.endDateTimeTz);
    });
  }, [conferenceStatus]);

  useEffect(() => {
    const dateNow = Date.now();

    const isFinished = checkIfFinished(dateNow, fishbowlDate);

    if (!isFinished) {
      setIntervalTimer(
        setInterval(() => {
          setTimeToDisplay(rendererCountdown(checkSecondsToDate(dateNow, fishbowlDate)));
        }, 1000)
      );
    } else {
      setCompletedTime(true);
      setTimeToDisplay(t('timesUp'));
      clearInterval(intervalTimer);
    }

    return () => clearInterval(intervalTimer);
  }, [fishbowlDate]);

  useEffect(() => {
    return () => clearInterval(intervalTimer);
  }, []);

  const rendererCountdown = (duration: number): string => {
    const conferenceNotStarted = conferenceStatus === IConferenceStatus?.NOT_STARTED;
    let timeLeftText;

    // console.log('Completed:', completedTime);
    // console.log('Time Status: ', timeStatus);
    // console.log('Conference Status: ', conferenceStatus);
    // console.log('Duration: ', duration);

    const minutes: number = Math.floor(duration / 60) % 60,
      hours: number = Math.floor(duration / 3600);

    if (completedTime && conferenceNotStarted) {
      timeLeftText = isModerator ? t('waitingHost') : t('waiting');
    } else if (completedTime && timeStatus === ITimeStatus.TIME_UP) {
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
