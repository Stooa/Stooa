/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IConferenceStatus } from '@/jitsi/Status';
import { Dispatch, SetStateAction } from 'react';
import { Fishbowl } from './api-platform';
import { Participant } from '@/types/participant';

export interface StooaContextValues {
  conferenceReady: boolean;
  conferenceStatus: IConferenceStatus;
  data: Fishbowl;
  isModerator: boolean;
  onIntroduction: boolean;
  timeStatus: string;
  participantToKick: Participant;
  setParticipantToKick: Dispatch<SetStateAction<Participant>>;
}
