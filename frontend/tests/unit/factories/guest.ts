/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Guest } from '@/types/api-platform/interfaces/guest';
import { faker } from '@faker-js/faker';

export const makeGuest = (): Guest => {
  return {
    '@id': faker.datatype.uuid(),
    'name': faker.name.firstName()
  };
};
