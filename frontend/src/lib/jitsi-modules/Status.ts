/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const CONFERENCE_NOT_STARTED = 'NOT_STARTED';
export const CONFERENCE_INTRODUCTION = 'INTRODUCTION';
export const CONFERENCE_RUNNING = 'RUNNING';
export const CONFERENCE_FINISHED = 'FINISHED';

export type IConferenceStatus =
  | typeof CONFERENCE_NOT_STARTED
  | typeof CONFERENCE_INTRODUCTION
  | typeof CONFERENCE_RUNNING
  | typeof CONFERENCE_FINISHED;

export const TIME_DEFAULT = 'DEFAULT';
export const TIME_ENDING = 'ENDING';
export const TIME_LAST_MINUTE = 'LAST_MINUTE';
export const TIME_UP = 'TIME_UP';

export type ITimeStatus =
  | typeof TIME_DEFAULT
  | typeof TIME_ENDING
  | typeof TIME_LAST_MINUTE
  | typeof TIME_UP;
