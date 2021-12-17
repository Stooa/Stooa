/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { Fishbowl } from '@/types/api-platform';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { StatusBox } from '@/components/App/Fishbowl/styles';
import HourGlass from '@/ui/svg/hourglass-countdown.svg';
import { useTimer } from 'use-timer';

interface Props {
  isModerator: boolean;
  data: Fishbowl;
  timeStatus: ITimeStatus;
  conferenceStatus: IConferenceStatus;
}

const CountDown: React.FC<Props> = ({ isModerator, data, timeStatus, conferenceStatus }) => {
  const [statusClass, setStatusClass] = useState('warning');
  const [displayTime, setDisplayTime] = useState<string>('');
  const [dateToCheck, setDateToCheck] = useState<string>(() => {
    const date = IConferenceStatus?.NOT_STARTED ? data.startDateTimeTz : data.endDateTimeTz;
    return date;
  });
  const [completed, setCompleted] = useState(() => {
    if (conferenceStatus === IConferenceStatus.FINISHED) {
      return true;
    }
    return false;
  });
  const { t } = useTranslation('fishbowl');

  const { time, pause } = useTimer({
    initialTime: Math.abs((Date.parse(dateToCheck) - Date.now()) / 1000),
    timerType: 'DECREMENTAL',
    autostart: true,
    onTimeUpdate: (time: number) => {
      const stringCountdown = rendererCountdown(time);
      setDisplayTime(stringCountdown);
    }
  });

  const rendererCountdown = (duration: number): string => {
    const conferenceNotStarted = conferenceStatus === IConferenceStatus?.NOT_STARTED;
    let timeLeftText;

    console.log('--- Renderer countdown running ---');
    console.log(duration);

    if (duration <= 0 || isNaN(duration)) {
      console.log('--- Renderer countdown finished ---');
      setCompleted(true);
      pause();
    }

    const minutes: number = Math.floor(duration / 60) % 60,
      hours: number = Math.floor(duration / 3600);

    if (completed && conferenceNotStarted) {
      timeLeftText = isModerator ? t('waitingHost') : t('waiting');
    } else if (completed) {
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

  useEffect(() => {
    if (
      conferenceStatus === IConferenceStatus.NOT_STARTED ||
      (conferenceStatus === IConferenceStatus.RUNNING && timeStatus === ITimeStatus.ENDING)
    ) {
      setStatusClass('warning');
    } else if (
      (conferenceStatus === IConferenceStatus.RUNNING &&
        (timeStatus === ITimeStatus.LAST_MINUTE || timeStatus === ITimeStatus.TIME_UP)) ||
      conferenceStatus === IConferenceStatus.FINISHED
    ) {
      setStatusClass('error');
    } else {
      setStatusClass('');
    }
  }, [timeStatus, conferenceStatus]);

  useEffect(() => {
    const date = IConferenceStatus?.NOT_STARTED ? data.startDateTimeTz : data.endDateTimeTz;
    setDateToCheck(date);
  }, []);

  useEffect(() => {
    rendererCountdown(time);
  }, [completed]);

  return (
    <StatusBox className={statusClass}>
      <HourGlass />
      <div className="countdown">{displayTime}</div>
      {/* <Countdown date={date} renderer={rendererCountdown} /> */}
    </StatusBox>
  );
};

export default CountDown;
