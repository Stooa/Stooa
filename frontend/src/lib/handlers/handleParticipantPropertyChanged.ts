/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dispatchEvent } from '@/lib/helpers';
import {
  SCREEN_SHARE_START,
  SCREEN_SHARE_STOP,
  RECORDING_START,
  RECORDING_STOP
} from '@/jitsi/Events';
import { Participant } from '@/types/participant';
import { JITSI_USER_JOIN, JITSI_USER_LEAVE } from '@/hooks/useJitsi';

export const handleParticipantPropertyChanged = (
  user: Participant,
  property: string,
  oldValue: string,
  newValue: string
) => {
  console.log(
    '[STOOA] Handle participant property changed',
    user.getId(),
    property,
    oldValue,
    newValue
  );

  if (property === 'screenShare' && newValue !== undefined) {
    dispatchEvent(newValue === 'true' ? SCREEN_SHARE_START : SCREEN_SHARE_STOP);

    return;
  }

  if (property === 'recording' && newValue !== undefined) {
    dispatchEvent(newValue === 'true' ? RECORDING_START : RECORDING_STOP);

    return;
  }

  if (property === 'joined') {
    dispatchEvent(newValue === 'yes' ? JITSI_USER_JOIN : JITSI_USER_LEAVE, { id: user.getId() });
  }
};
