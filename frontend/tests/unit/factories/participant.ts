/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Participant } from '@/types/participant';
import { Participant as ApiplatformParticipant } from '@/types/api-platform/interfaces/participant';
import { User } from '@/types/api-platform/interfaces/user';
// import { Guest } from '@/types/api-platform/interfaces/guest';

import { faker } from '@faker-js/faker';

const fakeUser: User = {
  '@id': faker.datatype.uuid(),
  'name': faker.name.firstName(),
  'surnames': faker.name.lastName(),
  'allowShareData': faker.datatype.boolean(),
  'linkedinProfile': 'https://www.linkedin.com/in/wearestooa',
  'twitterProfile': 'https://www.twitter.com/wearestooa',
  'plainPassword': faker.internet.password(),
  'email': faker.internet.email(),
  'locale': 'es'
};

// const fakeGuest: Guest = {
//   '@id': faker.datatype.uuid(),
//   'name': faker.name.firstName()
// };

export const makeParticipant = (): Participant => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    linkedin: 'https://www.linkedin.com/in/wearestooa',
    twitter: 'https://www.twitter.com/wearestooa',
    isModerator: true,
    isCurrentUser: true,
    guestId: '',
    joined: false,
    isMuted: false,
    isVideoMuted: false,
    getId: () => faker.datatype.uuid(),
    getDisplayName: () => faker.name.firstName()
  };
};

export const makeApiplatformParticipant = (): ApiplatformParticipant => {
  return {
    '@id': faker.datatype.uuid(),
    'user': fakeUser,
    'guest': undefined,
    'lastPing': new Date(),
    'fishbowl': faker.datatype.uuid()
  };
};
