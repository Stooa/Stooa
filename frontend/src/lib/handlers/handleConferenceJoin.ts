/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dispatchEvent } from '@/lib/helpers';
import { CONFERENCE_START } from '@/jitsi/Events';
import userRepository from '@/jitsi/User';
import JitsiConference from 'lib-jitsi-meet/types/hand-crafted/JitsiConference';

export const handleConferenceJoin = (conference: JitsiConference) => {
  // isJoined = true;

  // conference.setDisplayName(userName);
  // conference.setLocalParticipantProperty('twitter', twitter);
  // conference.setLocalParticipantProperty('linkedin', linkedin);
  // conference.setLocalParticipantProperty('isModerator', isModerator);

  userRepository.setUser({ id: conference.myUserId() });

  dispatchEvent(CONFERENCE_START, { status: true, myUserId: conference.myUserId() });

  console.log('[STOOA] Handle conference join');
};
