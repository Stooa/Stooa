/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Participant } from '@/types/participant';

import { faker } from '@faker-js/faker';

export const makeFishbowlParticipant = (): Participant => {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    linkedin: 'https://www.linkedin.com/in/wearestooa',
    twitter: 'https://www.twitter.com/wearestooa',
    isModerator: true,
    isCurrentUser: true,
    guestId: '',
    joined: false,
    isMuted: false,
    isVideoMuted: false,
    getId: () => faker.string.uuid(),
    getDisplayName: () => faker.person.firstName()
  };
};
