/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { faker } from '@faker-js/faker';
import { User } from '@/types/api-platform/interfaces/user';

export const makeUser = (): User => {
  return {
    '@id': faker.string.uuid(),
    'name': faker.person.firstName(),
    'surnames': faker.person.lastName(),
    'allowShareData': faker.datatype.boolean(),
    'linkedinProfile': 'https://www.linkedin.com/in/wearestooa',
    'twitterProfile': 'https://www.twitter.com/wearestooa',
    'plainPassword': faker.internet.password(),
    'email': faker.internet.email(),
    'locale': 'es'
  };
};
