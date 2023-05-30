/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import seatsRepository from '@/jitsi/Seats';
import tracksRepository from '@/jitsi/Tracks';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';

export const handleCommandLeave = (conference: JitsiConference, values): unknown => {
  const { value } = values;

  seatsRepository.leave(value);
  tracksRepository.removeTracks(value);
  conference.selectParticipants(seatsRepository.getIds());

  console.log('[STOOA] Leave', value);

  return value;
};
