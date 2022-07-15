/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { scrolllbarStyle } from '@/ui/Scrollbar';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import { TITLE_MD } from '@/ui/Titles';
import styled from 'styled-components';
import { StyledListItem } from '../Participants/styles';

const StyledContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;

  row-gap: ${space(8)};

  ${media.min('desktopLarge')`
    grid-template-columns: 1fr 1fr;
    column-gap: ${space(8)};
    padding-top: ${space(6)};
  `}

  & .blobs-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;

    & svg:first-child {
      position: absolute;
      left: -160px;
      bottom: -296px;

      ${media.min('desktop')`
        left: -120px;
        bottom: -260px;
      `}
    }

    & svg:last-child {
      position: absolute;
      right: -320px;
      bottom: -207px;
      ${media.min('desktop')`
        right: -280px;
        bottom: -117px;
      `}
    }
  }
`;

const StyledFishbowlInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  z-index: 1;

  & > .counter {
    ${TITLE_MD}
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space(4)};
    text-align: center;
  }

  & > svg {
    margin-bottom: ${space(2)};
    align-self: center;
  }

  & > button {
    align-self: flex-start;
  }

  ${media.min('tablet')`
    padding: ${space(2)} ${space(8)} 0;
  `}
`;

const StyledParticipantsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const StyledParticipantListWrapper = styled.div`
  width: 100%;
  max-width: 620px;

  border: 1px solid ${COLOR_NEUTRO_300};
  border-radius: 4px;
  overflow: hidden;

  & > .participant-list__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${space()} ${space(2)};

    color: ${COLOR_NEUTRO_800};

    background-color: ${COLOR_NEUTRO_300};

    & > .participant-list__counter {
      display: flex;
      align-items: center;
      color: ${COLOR_NEUTRO_700};

      & :last-child {
        width: 16px;
        margin-left: ${space(0.5)};
      }

      & svg.loader {
        color: ${COLOR_NEUTRO_700};
        animation: spin 1s linear infinite;

        & circle {
          opacity: 0.25;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
`;

const StyledRegisterNotification = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${space(2)} ${space(2)};

  color: ${COLOR_NEUTRO_800};
  background-color: ${COLOR_NEUTRO_200};

  & > a {
    white-space: nowrap;
  }
`;

const StyledPrefishbowlParticipant = styled(StyledListItem)`
  padding: ${space(2)} ${space(3)};

  &:nth-child(even) .placeholder {
    width: 5rem;
  }

  & > .placeholder {
    height: 1rem;
    border-radius: 2rem;
    background-color: ${COLOR_NEUTRO_300};
    width: 8rem;
  }
`;

const StyledParticipantList = styled.ul`
  max-height: 420px;
  padding: 0;
  color: ${COLOR_NEUTRO_700};

  background-color: ${COLOR_NEUTRO_100};
  ${scrolllbarStyle}

  &.scroll {
    overflow-y: scroll;
  }

  ${media.min('desktop')`
    height: 70vh;
    max-height: 720px;
    min-height: 600px;
  `}
`;

const StyledFishbowlDataWrapper = styled.div`
  width: 100%;
  ${media.between('tablet', 'desktopLarge')`
    max-width: 620px;
  `}
`;

export {
  StyledContainer,
  StyledFishbowlInformation,
  StyledParticipantList,
  StyledParticipantsColumn,
  StyledParticipantListWrapper,
  StyledRegisterNotification,
  StyledPrefishbowlParticipant,
  StyledFishbowlDataWrapper
};
