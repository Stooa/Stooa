/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';

import { SEATS_CHANGE } from '@/jitsi/Events';
import useEventListener from '@/hooks/useEventListener';

type IProps = {
  detail: {
    seats: [];
  };
};

const useSeatsAvailable = () => {
  const [seatsAvailable, setSeatsAvailable] = useState<[] | boolean>(true);

  useEventListener(SEATS_CHANGE, ({ detail: { seats } }: IProps) => {
    setSeatsAvailable(seats);
    return seatsAvailable;
  });

  return seatsAvailable;
};

export default useSeatsAvailable;
