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
import { Fishbowl } from '../api-platform';

export interface StooaContextValues {
  conferenceReady: boolean;
  conferenceStatus: IConferenceStatus;
  data: Fishbowl;
  isModerator: boolean;
  onIntroduction: boolean;
  timeStatus: ITimeStatus;
  participantToKick: Participant | undefined;
  setParticipantToKick: Dispatch<SetStateAction<Participant | undefined>>;
  getPassword: () => string;
  setFishbowlPassword: Dispatch<SetStateAction<string | undefined>>;
  isSharing: boolean;
  setIsSharing: Dispatch<SetStateAction<boolean>>;
  clientRunning: boolean;
  setClientRunning: Dispatch<SetStateAction<boolean>>;
  startRecording: () => Promise<{
    status: 'success' | 'error';
    type?: 'wrong-tab' | 'no-combined-stream';
  }>;
  stopRecording: () => Promise<boolean>;
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  feedbackAlert: boolean;
  setFeedbackAlert: Dispatch<SetStateAction<boolean>>;
  gaveFeedback: boolean;
  setGaveFeedback: Dispatch<SetStateAction<boolean>>;
  isTranscriptionEnabled: boolean;
  setIsTranscriptionEnabled: Dispatch<SetStateAction<boolean>>;
  isTranslationEnabled: boolean;
  setIsTranslationEnabled: Dispatch<SetStateAction<boolean>>;
}
