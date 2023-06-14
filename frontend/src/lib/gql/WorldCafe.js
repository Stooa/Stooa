/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const CREATE_WORLD_CAFE = gql`
  mutation CreateWorldCafe($input: createWorldCafeInput!) {
    createWorldCafe(input: $input) {
      worldCafe {
        id
        name
        slug
        description
        locale
      }
    }
  }
`;

export {
  CREATE_WORLD_CAFE
};
