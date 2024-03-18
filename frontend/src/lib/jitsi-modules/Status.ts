/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export enum IConferenceStatus {
  NOT_STARTED = 'NOT_STARTED',
  INTRODUCTION = 'INTRODUCTION',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED'
}

export enum WorldCafeStatus {
  NOT_STARTED = 'NOT_STARTED',
  INTRODUCTION = 'INTRODUCTION',
  RUNNING = 'RUNNING',
  CONCLUSION = 'CONCLUSION',
  FINISHED = 'FINISHED'
}

export enum ITimeStatus {
  DEFAULT = 'DEFAULT',
  ENDING = 'ENDING',
  LAST_MINUTE = 'LAST_MINUTE',
  TIME_UP = 'TIME_UP'
}
