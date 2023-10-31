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

export enum TypeOfFishbowls {
  tomorrow = 'tomorrow-fishbowl',
  current = 'current-fishbowl',
  currentNotOwned = 'current-not-owned-fishbowl',
  currentPrivate = 'current-private-fishbowl',
  currentWithIntroduction = 'current-with-introduction-fishbowl',
  currentPrivateNotOwned = 'current-not-owned-private-fishbowl'
}

const today = new Date();
today.setMinutes(today.getMinutes() + 10);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const createMockFishbowl = (type: TypeOfFishbowls, slug) => {
  const isPrivate =
    type === TypeOfFishbowls.currentPrivate || type === TypeOfFishbowls.currentPrivateNotOwned;
  return {
    bySlugQueryFishbowl: {
      id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
      name: faker.lorem.words(3),
      description: faker.lorem.words(10),
      slug,
      timezone: 'Europe/Madrid',
      locale: 'en',
      host:
        type === TypeOfFishbowls.currentNotOwned || type === TypeOfFishbowls.currentPrivateNotOwned
          ? '/users/non-existing-user'
          : '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
      currentStatus: 'not_started',
      isFishbowlNow: false,
      hasIntroduction: type === TypeOfFishbowls.currentWithIntroduction,
      startDateTimeTz: type === TypeOfFishbowls.tomorrow ? tomorrow.toString() : today.toString(),
      endDateTimeTz: type === TypeOfFishbowls.tomorrow ? tomorrow.toString() : today.toString(),
      durationFormatted: '03:00',
      isPrivate: isPrivate,
      plainPassword: isPrivate ? 'stooa123' : null,
      startDateTime: type === TypeOfFishbowls.tomorrow ? tomorrow : today,
      __typename: 'Fishbowl'
    }
  };
};

export const handlers = [
  graphql.query('BySlugQueryFishbowl', (req, res, ctx) => {
    console.log('MSW REQ', req.variables.slug);

    switch (req.variables.slug) {
      case TypeOfFishbowls.tomorrow:
        return res(ctx.data(createMockFishbowl(TypeOfFishbowls.tomorrow, req.variables.slug)));
      case TypeOfFishbowls.current:
        return res(ctx.data(createMockFishbowl(TypeOfFishbowls.current, req.variables.slug)));
      case TypeOfFishbowls.currentNotOwned:
        return res(
          ctx.data(createMockFishbowl(TypeOfFishbowls.currentNotOwned, req.variables.slug))
        );
      case TypeOfFishbowls.currentPrivate:
        return res(
          ctx.data(createMockFishbowl(TypeOfFishbowls.currentPrivate, req.variables.slug))
        );
      case TypeOfFishbowls.currentWithIntroduction:
        return res(
          ctx.data(createMockFishbowl(TypeOfFishbowls.currentWithIntroduction, req.variables.slug))
        );
      case TypeOfFishbowls.currentPrivateNotOwned:
        return res(
          ctx.data(createMockFishbowl(TypeOfFishbowls.currentPrivateNotOwned, req.variables.slug))
        );
      default:
        return res(ctx.data(createMockFishbowl(TypeOfFishbowls.tomorrow, req.variables.slug)));
    }
  })
];
