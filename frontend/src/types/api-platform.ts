/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Fishbowl as apiPlatformFishbowl } from './api-platform/interfaces/fishbowl';

export interface Fishbowl extends Omit<apiPlatformFishbowl, 'startDateTimeTz' | 'endDateTimeTz'> {
  startDateTimeTz: string;
  endDateTimeTz: string;
}
