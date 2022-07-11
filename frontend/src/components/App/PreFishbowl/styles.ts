/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
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
  padding-top: ${space(6)};

  row-gap: ${space(8)};

  ${media.min('desktop')`
    grid-template-columns: 1fr 1fr;
    column-gap: ${space(8)};
  `}
`;

const StyledFishbowlInformation = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${space(2)} ${space(8)} 0;

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

  /* ELLIPSIS ANIMATION */

  @keyframes ellipsis {
    to {
      width: 1em;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1em;
    }
  }
`;

const StyledParticipantsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledParticipantListWrapper = styled.div`
  max-width: 512px;

  border: 1px solid ${COLOR_NEUTRO_300};
  border-radius: 4px;

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
        margin-left: ${space(0.5)};
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
  max-height: 620px;
  padding: 0;

  background-color: ${COLOR_NEUTRO_100};

  &.scroll {
    overflow-y: scroll;
  }

  ${media.min('desktop')`
  max-height: 620px;
  `}
`;

export {
  StyledContainer,
  StyledFishbowlInformation,
  StyledParticipantList,
  StyledParticipantsColumn,
  StyledParticipantListWrapper,
  StyledRegisterNotification,
  StyledPrefishbowlParticipant
};
