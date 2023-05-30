/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import seatsRepository from '@/jitsi/Seats';

export const handleParticipantConnectionStatusChanged = (id, status) => {
  seatsRepository.updateStatus(id, status);

  console.log('[STOOA] Handle participant connection status changed', id, status);
};
