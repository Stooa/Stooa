/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledTimeDisplay } from './styles';

const RecordingTimer = () => {
  const [timeToDisplay, setTimeToDisplay] = useState('00:00');
  const [larger, setLarger] = useState(false);

  const startTime = useRef(new Date());

  const hoursToDisplay = (hours: number) => {
    if (hours > 0) {
      setLarger(true);
      return `${hours > 9 ? hours : `0${hours}`}:`;
    }
    return '';
  };

  const timer = useCallback(() => {
    const now = new Date();
    const diff = now.getTime() - startTime.current.getTime();

    const seconds = Math.floor((diff / 1000) % 60);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff - hours * 1000 * 60 * 60) / (1000 * 60));

    setTimeToDisplay(
      `${hoursToDisplay(hours)}${minutes > 9 ? minutes : `0${minutes}`}:${
        seconds > 9 ? seconds : `0${seconds}`
      }`
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      timer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return <StyledTimeDisplay className={larger ? 'larger' : ''}>{timeToDisplay}</StyledTimeDisplay>;
};

export default RecordingTimer;
