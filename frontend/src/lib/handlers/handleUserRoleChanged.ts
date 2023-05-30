/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CONFERENCE_IS_LOCKABLE } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';

export const handleUserRoleChanged = (conference: JitsiConference) => {
  const role = conference.getRole();

  console.log('[STOOA] User role changed', role);

  if (role === 'moderator') {
    dispatchEvent(CONFERENCE_IS_LOCKABLE);
  }
};
