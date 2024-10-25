/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Guest } from './guest';
import { User } from './user';

export interface Participant {
  '@id'?: string;
  readonly 'user'?: User;
  readonly 'guest'?: Guest;
  readonly 'lastPing': Date;
  readonly 'fishbowl': string;
}
