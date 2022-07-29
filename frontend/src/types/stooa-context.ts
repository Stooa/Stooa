/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import { Dispatch, SetStateAction } from 'react';
import { Participant } from '@/types/participant';
import { Fishbowl } from './api-platform';

export interface StooaContextValues {
  conferenceReady: boolean;
  conferenceStatus: IConferenceStatus;
  data: Fishbowl;
  isModerator: boolean;
  onIntroduction: boolean;
  timeStatus: ITimeStatus;
  participantToKick: Participant | undefined;
  setParticipantToKick: Dispatch<SetStateAction<Participant | undefined>>;
  showOnBoardingModal: boolean;
  setShowOnBoardingModal: Dispatch<SetStateAction<boolean>>;
  toggleOnBoarding: (location: string) => void;
  activeOnBoardingTooltip: boolean;
  setActiveOnBoardingTooltip: Dispatch<SetStateAction<boolean>>;
  onBoardingTooltipSeen: boolean;
  setOnBoardingTooltipSeen: Dispatch<SetStateAction<boolean>>;
  showOnBoardingTour: boolean;
  setShowOnBoardingTour: Dispatch<SetStateAction<boolean>>;
}
