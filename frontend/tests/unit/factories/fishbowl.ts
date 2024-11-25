/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { faker } from '@faker-js/faker';
import { Fishbowl } from '@/types/api-platform';
import { makeFeedback } from './feedbacks';
import { makeParticipant } from './participant';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoPlusOneHour = new Date(twoDaysAgo);
twoDaysAgoPlusOneHour.setHours(twoDaysAgoPlusOneHour.getHours() + 1);

export const makeCurrentFishbowl = (): Fishbowl => {
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
    participants: [],
    feedbacks: [],
    isFishbowlNow: true,
    hasIntroduction: false,
    startDateTimeTz: today.toString(),
    endDateTimeTz: tomorrow.toString(),
    durationFormatted: '02:00',
    isPrivate: true,
    plainPassword: undefined,
    startDateTime: today
  };
};

export const makePastFishbowl = (hasParticipants: boolean, hasFeedbacks: boolean): Fishbowl => {
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
    isFishbowlNow: true,
    participants: hasParticipants ? [makeParticipant()] : [],
    feedbacks: hasFeedbacks ? [makeFeedback()] : [],
    hasIntroduction: false,
    startDateTimeTz: twoDaysAgo.toString(),
    endDateTimeTz: twoDaysAgoPlusOneHour.toString(),
    durationFormatted: '02:00',
    isPrivate: true,
    plainPassword: undefined,
    startDateTime: today
  };
};
