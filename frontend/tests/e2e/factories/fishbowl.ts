/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Fishbowl } from '@/types/api-platform';
import { faker } from '@faker-js/faker';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const makeGQLTomorrowFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: {
      email: faker.internet.email(),
      locale: 'en',
      name: faker.person.firstName(),
      surnames: faker.person.lastName()
    },
    currentStatus: 'not_started',
    isFishbowlNow: false,
    hasIntroduction: false,
    startDateTimeTz: tomorrow.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '03:00',
    isPrivate: false,
    plainPassword: undefined,
    startDateTime: tomorrow
  };
};

export const makeGQLCurrentFishbowlWithIntroduction = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: {
      email: faker.internet.email(),
      locale: 'en',
      name: faker.person.firstName(),
      surnames: faker.person.lastName()
    },
    currentStatus: 'not_started',
    isFishbowlNow: false,
    hasIntroduction: true,
    startDateTimeTz: today.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '02:00',
    isPrivate: false,
    plainPassword: undefined,
    startDateTime: today
  };
};

export const makeGQLCurrentFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: {
      email: faker.internet.email(),
      locale: 'en',
      name: faker.person.firstName(),
      surnames: faker.person.lastName()
    },
    currentStatus: 'not_started',
    isFishbowlNow: false,
    hasIntroduction: false,
    startDateTimeTz: today.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '02:00',
    isPrivate: false,
    plainPassword: undefined,
    startDateTime: today
  };
};

export const makeGQLCurrentPrivateFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: {
      email: faker.internet.email(),
      locale: 'en',
      name: faker.person.firstName(),
      surnames: faker.person.lastName()
    },
    currentStatus: 'not_started',
    isFishbowlNow: false,
    hasIntroduction: false,
    startDateTimeTz: today.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '02:00',
    isPrivate: true,
    plainPassword: 'stooa123',
    startDateTime: today
  };
};

export const makeGQLCurrentNotOwnedFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: {
      email: faker.internet.email(),
      locale: 'en',
      name: faker.person.firstName(),
      surnames: faker.person.lastName()
    },
    currentStatus: 'not_started',
    isFishbowlNow: false,
    hasIntroduction: false,
    startDateTimeTz: today.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '02:00',
    isPrivate: false,
    plainPassword: undefined,
    startDateTime: today
  };
};
