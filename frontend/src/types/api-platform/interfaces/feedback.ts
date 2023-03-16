/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Participant } from './participant';

export interface Feedback {
  '@id'?: string;
  'timezone'?: string;
  'satisfaction': string;
  'comment'?: string;
  'email'?: string;
  'origin'?: string;
  'fishbowl'?: string;
  'participant'?: Participant;
  readonly 'createdDateTime'?: Date;
}
