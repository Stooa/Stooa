/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Participant } from '@/types/api-platform/interfaces/participant';
import { faker } from '@faker-js/faker';
import { makeUser } from './user';

export const makeParticipant = (): Participant => {
  return {
    '@id': faker.string.uuid(),
    'user': makeUser(),
    'guest': undefined,
    'lastPing': new Date(),
    'fishbowl': faker.string.uuid()
  };
};
