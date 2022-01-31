/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const CREATE_FISHBOWL = gql`
  mutation CreateFishbowl($input: createFishbowlInput!) {
    createFishbowl(input: $input) {
      fishbowl {
        id
        name
        slug
        description
        locale
        startDateTimeTz
        endDateTimeTz
      }
    }
  }
`;

const UPDATE_FISHBOWL = gql`
  mutation UpdateFishbowl($input: updateFishbowlInput!) {
    updateFishbowl(input: $input) {
      fishbowl {
        id
        name
        slug
        description
        locale
        startDateTimeTz
        endDateTimeTz
      }
    }
  }
`;

const DELETE_FISHBOWL = gql`
  mutation DeleteFishbowl($input: deleteFishbowlInput!) {
    deleteFishbowl(input: $input) {
      fishbowl {
        id
      }
    }
  }
`;

const GET_FISHBOWL = gql`
  query BySlugQueryFishbowl($slug: String!) {
    bySlugQueryFishbowl(slug: $slug) {
      id
      name
      slug
      description
      locale
      startDateTimeTz
      endDateTimeTz
      durationFormatted
      slug
      isFishbowlNow
    }
  }
`;

const IS_FISHBOWL_CREATOR = gql`
  query IsCreatorOfFishbowl($slug: String!) {
    isCreatorOfFishbowl(slug: $slug) {
      currentStatus
    }
  }
`;

const INTRODUCE_FISHBOWL = gql`
  mutation IntroduceFishbowl($input: introduceFishbowlInput!) {
    introduceFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

const RUN_FISHBOWL = gql`
  mutation RunFishbowl($input: runFishbowlInput!) {
    runFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

const FINISH_FISHBOWL = gql`
  mutation FinishFishbowl($input: finishFishbowlInput!) {
    finishFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

const CREATE_GUEST = gql`
  mutation CreateGuest($input: createGuestInput!) {
    createGuest(input: $input) {
      guest {
        id
      }
    }
  }
`;

export {
  CREATE_FISHBOWL,
  CREATE_GUEST,
  DELETE_FISHBOWL,
  GET_FISHBOWL,
  FINISH_FISHBOWL,
  INTRODUCE_FISHBOWL,
  IS_FISHBOWL_CREATOR,
  RUN_FISHBOWL,
  UPDATE_FISHBOWL
};
