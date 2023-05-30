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

export const handleCommandJoin = (conference: JitsiConference, values): unknown => {
  const { value } = values;

  const seat = seatsRepository.join(value);
  tracksRepository.createTracks(value, seat);
  conference.selectParticipants(seatsRepository.getIds());

  console.log('[STOOA] Join', value);

  return value;
};
