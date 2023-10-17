/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { faker } from '@faker-js/faker';
import { graphql } from 'msw';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const handlers = [
  graphql.query('BySlugQueryFishbowl', (req, res, ctx) => {
    console.log('MSW REQ', req);
    return res(
      ctx.data({
        bySlugQueryFishbowl: {
          id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
          name: faker.lorem.words(3),
          description: faker.lorem.words(10),
          slug: 'test-fishbowl',
          timezone: 'Europe/Madrid',
          locale: 'en',
          host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
          currentStatus: 'not_started',
          isFishbowlNow: false,
          hasIntroduction: false,
          startDateTimeTz: tomorrow.toString(),
          endDateTimeTz: tomorrow.toString(),
          durationFormatted: '03:00',
          isPrivate: false,
          plainPassword: '',
          startDateTime: tomorrow,
          __typename: 'Fishbowl'
        }
      })
    );
  })
];
