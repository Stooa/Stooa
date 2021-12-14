/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Countdown, { zeroPad } from 'react-countdown';
import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { Fishbowl } from '@/types/api-platform';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { StatusBox } from '@/components/App/Fishbowl/styles';
import HourGlass from '@/ui/svg/hourglass-countdown.svg';

interface Props {
  isModerator: boolean;
  data: Fishbowl;
  timeStatus: ITimeStatus;
  conferenceStatus: IConferenceStatus;
}

const CountDown: React.FC<Props> = ({ isModerator, data, timeStatus, conferenceStatus }) => {
  const [statusClass, setStatusClass] = useState('warning');
  const { t } = useTranslation('fishbowl');

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

  const rendererCountdown = ({ hours, minutes, completed, total }) => {
    console.log('----- Renderer: ', minutes, '-----');
    const conferenceNotStarted = conferenceStatus === IConferenceStatus?.NOT_STARTED;
    let timeLeftText;

    if (completed && conferenceNotStarted) {
      timeLeftText = isModerator ? t('waitingHost') : t('waiting');
    } else if (completed) {
      timeLeftText = t('timesUp');
    } else if (timeStatus === ITimeStatus.TIME_UP) {
      timeLeftText = t('lastMinute');
    } else if (minutes === 0) {
      const time = `1${t('form:fishbowl.minutes')}`;
      timeLeftText = t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_one', { time });
    } else {
      const hoursText = t('form:fishbowl.hours');
      const minutesText = t('form:fishbowl.minutes');
      const time =
        hours > 0
          ? `${zeroPad(hours)}${hoursText}:${zeroPad(minutes + 1)}`
          : Math.ceil(total / 60_000);
      timeLeftText = t(conferenceNotStarted ? 'timeToStart' : 'timeLeft_other', {
        time: `${time}${minutesText}`
      });
    }

    return <span>{timeLeftText}</span>;
  };

  const date =
    conferenceStatus === IConferenceStatus?.NOT_STARTED ? data.startDateTimeTz : data.endDateTimeTz;

  return (
    <StatusBox className={statusClass}>
      <HourGlass />
      <Countdown date={date} renderer={rendererCountdown} />
    </StatusBox>
  );
};

export default CountDown;
