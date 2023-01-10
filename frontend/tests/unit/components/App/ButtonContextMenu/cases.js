/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IConferenceStatus } from '@/jitsi/Status';

export const PARTICIPANT_TEST_CASES = [
  {
    isModerator: true,
    isCurrentUser: true,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    shouldRender: false
  },
  {
    isModerator: true,
    isCurrentUser: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    shouldRender: false
  },
  {
    isModerator: true,
    isCurrentUser: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.INTRODUCTION,
    shouldRender: false
  },
  {
    isModerator: true,
    isCurrentUser: false,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    shouldRender: true
  },
  {
    isModerator: true,
    isCurrentUser: true,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    shouldRender: false
  },
  // NOT MODERATOR CASES
  {
    isModerator: false,
    isCurrentUser: true,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    shouldRender: false
  },
  {
    isModerator: false,
    isCurrentUser: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    shouldRender: false
  },
  {
    isModerator: false,
    isCurrentUser: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.INTRODUCTION,
    shouldRender: false
  },
  {
    isModerator: false,
    isCurrentUser: false,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    shouldRender: false
  },
  {
    isModerator: false,
    isCurrentUser: true,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    shouldRender: false
  }
];

export const SEAT_TEST_CASES = [
  {
    isModerator: true,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: true,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: true,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.INTRODUCTION,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: true,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    seatNumber: 2,
    shouldRender: false
  },
  {
    isModerator: true,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    seatNumber: 1,
    shouldRender: true
  },
  // NOT MODERATOR CASES
  {
    isModerator: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.NOT_STARTED,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: false,
    conferenceReady: false,
    fishbowlReady: false,
    conferenceStatus: IConferenceStatus.INTRODUCTION,
    seatNumber: 1,
    shouldRender: false
  },
  {
    isModerator: false,
    conferenceReady: true,
    fishbowlReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    seatNumber: 1,
    shouldRender: false
  }
];
