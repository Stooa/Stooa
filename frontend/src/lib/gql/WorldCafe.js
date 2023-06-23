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

const GET_WORLD_CAFE = gql`
  query BySlugQueryWorldCafe($slug: String!) {
    bySlugQueryWorldCafe(slug: $slug) {
      id
      name
      slug
      description
      locale
      startDateTimeTz
      hasExtraRoundTime
      roundMinutes
      questions {
        id
        title
        description
        position
      }
    }
  }
`;

export { CREATE_WORLD_CAFE, GET_WORLD_CAFE };
