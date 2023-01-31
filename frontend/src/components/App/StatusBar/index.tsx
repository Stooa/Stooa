/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';

import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { StatusBox } from '@/components/App/Fishbowl/styles';
import HourGlass from '@/ui/svg/hourglass-countdown.svg';
import { Counter } from '@/components/App/StatusBar/Counter';
import { useStooa } from '@/contexts/StooaManager';

const StatusBar: React.FC = () => {
  const [statusClass, setStatusClass] = useState('warning');
  const { conferenceStatus, timeStatus } = useStooa();

  useEffect(() => {
    if (conferenceStatus === IConferenceStatus.RUNNING && timeStatus === ITimeStatus.ENDING) {
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

  return (
    <StatusBox className={statusClass}>
      <HourGlass />
      <Counter />
    </StatusBox>
  );
};

export default StatusBar;
