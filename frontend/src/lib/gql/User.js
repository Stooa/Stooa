/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

gql`
  mutation CreateUser($input: createUserInput!) {
    createUser(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

gql`
  mutation UpdateUser($input: updateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        surnames
      }
    }
  }
`;

gql`
  query SelfUser {
    selfUser {
      id
      name
      surnames
      email
      allowShareData
      linkedinProfile
      twitterProfile
    }
  }
`;
