/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Feedback } from '@/types/api-platform/interfaces/feedback';
import { faker } from '@faker-js/faker';
import { makeParticipant } from './participant';

export const makeFeedback = (): Feedback => {
  return {
    '@id': faker.string.uuid(),
    'timezone': faker.location.timeZone(),
    'satisfaction': 'sad',
    'comment': faker.lorem.sentence(4),
    'email': faker.internet.email(),
    'origin': 'thank-you',
    'fishbowl': faker.string.uuid(),
    'participant': makeParticipant(),
    'createdDateTime': new Date()
  };
};
