/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StandardWYSIWYGStyles } from '@/components/Common/RichEditor/styles';
import { media, space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledInvitationLanding = styled.div`
  position: relative;
  display: grid;
  column-gap: ${space(10)};
  align-items: flex-start;
  grid-template-columns: 1fr;

  padding-block: ${space(4)};

  ${media.min('desktop')`
  padding-block: ${space(10)};
    grid-template-columns: 1fr 400px;
  `}
`;

const StyledInvitationContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  row-gap: ${space(8)};
  width: 100%;

  text-align: left;

  max-width: 720px;

  & .fishbowl-preview {
    position: relative;
    width: 100%;
    justify-self: center;
    aspect-ratio: 16 / 9;
    align-self: center;

    filter: drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.1));

    &.mobile {
      margin-bottom: ${space(4)};
    }

    & img {
      width: 100%;
      height: 100%;

      left: 0;
      top: 0;
      object-fit: cover;
      object-position: left;
      margin: 0 auto;
    }
  }
`;

const StyledInvitationHero = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  row-gap: ${space(1.5)};

  & button:disabled {
    & svg {
      width: 1.25rem;
      height: 1.25rem;

      & path {
        fill: currentColor;
      }
    }
  }
`;

const StyledFixedFishbowlData = styled.div`
  position: sticky;
  top: ${space(4)};
  left: 0;

  ${media.max('desktop')`
      display: none ;
  `}
`;

const StyledInvitationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${space(3)};
  width: 100%;

  scroll-margin-top: ${space(4)};

  text-align: left;
`;

const StyledMobileDataCard = styled.div`
  width: 100%;
  ${media.min('desktop')`
    display: none;
  `}
`;

const StyledInventationLandingContentBody = styled(StandardWYSIWYGStyles)`
  * + p {
    margin-top: ${space(2)};
  }
`;

export {
  StyledInvitationContent,
  StyledInvitationHero,
  StyledInvitationLanding,
  StyledFixedFishbowlData,
  StyledInvitationFormWrapper,
  StyledInventationLandingContentBody,
  StyledMobileDataCard
};
