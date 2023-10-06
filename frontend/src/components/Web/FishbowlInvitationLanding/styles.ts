/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StandardWYSIWYGStyles } from '@/components/Common/RichEditor/styles';
import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledInvitationLanding = styled.div`
  position: relative;
  display: grid;
  column-gap: ${space(10)};
  align-items: flex-start;
  grid-template-columns: 1fr 400px;

  padding-bottom: ${space(10)};
`;

const StyledInvitationContent = styled(StandardWYSIWYGStyles)`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  row-gap: ${space(10)};
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
  flex-direction: column;
  align-items: flex-start;
  row-gap: ${space(2)};
`;

const StyledFixedFishbowlData = styled.div`
  position: sticky;
  top: ${space(4)};
  left: 0;
`;

const StyledInvitationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${space(2)};
  width: 100%;

  text-align: left;
`;

export {
  StyledInvitationContent,
  StyledInvitationHero,
  StyledInvitationLanding,
  StyledFixedFishbowlData,
  StyledInvitationFormWrapper
};
