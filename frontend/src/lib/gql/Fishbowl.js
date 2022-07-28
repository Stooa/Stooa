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
        isFishbowlNow
        hasIntroduction
      }
    }
  }
`;

gql`
  mutation UpdateFishbowl($input: updateFishbowlInput!) {
    updateFishbowl(input: $input) {
      fishbowl {
        id
        name
        description
        startDateTimeTz
        timezone
        locale
        duration
        durationFormatted
        isFishbowlNow
        hasIntroduction
      }
    }
  }
`;

gql`
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
      hasIntroduction
      currentStatus
    }
  }
`;

gql`
  query IsCreatorOfFishbowl($slug: String!) {
    isCreatorOfFishbowl(slug: $slug) {
      currentStatus
    }
  }
`;

gql`
  mutation NoIntroRunFishbowl($input: noIntroRunFishbowlInput!) {
    noIntroRunFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

gql`
  mutation IntroduceFishbowl($input: introduceFishbowlInput!) {
    introduceFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

gql`
  mutation RunFishbowl($input: runFishbowlInput!) {
    runFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

gql`
  mutation FinishFishbowl($input: finishFishbowlInput!) {
    finishFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;

gql`
  mutation CreateGuest($input: createGuestInput!) {
    createGuest(input: $input) {
      guest {
        id
      }
    }
  }
`;
