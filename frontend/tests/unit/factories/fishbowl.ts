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
import { makeApiplatformParticipant } from './participant';
import { fakeFeedback } from './feedbacks';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const TwoDaysAgoPlusOneHour = new Date(twoDaysAgo);
TwoDaysAgoPlusOneHour.setHours(TwoDaysAgoPlusOneHour.getHours() + 1);

export const makeCurrentFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
    currentStatus: 'not_started',
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

export const makePastFishbowl = (): Fishbowl => {
  return {
    id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
    name: faker.lorem.words(3),
    description: faker.lorem.words(10),
    slug: 'test-fishbowl',
    timezone: 'Europe/Madrid',
    locale: 'en',
    host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
    currentStatus: 'not_started',
    isFishbowlNow: true,
    participants: [makeApiplatformParticipant()],
    feedbacks: [fakeFeedback],
    hasIntroduction: false,
    startDateTimeTz: twoDaysAgo.toString(),
    endDateTimeTz: TwoDaysAgoPlusOneHour.toString(),
    durationFormatted: '02:00',
    isPrivate: true,
    plainPassword: undefined,
    startDateTime: today
  };
};
