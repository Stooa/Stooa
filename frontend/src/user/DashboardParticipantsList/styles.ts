/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledListWrapper = styled.div``;

const StyledParticipantItem = styled.div`
  margin-bottom: ${space(2)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & .participant__contacts {
    display: flex;
    justify-content: space-between;
  }

  & .participant__socials {
    display: flex;
    gap: ${space(1)};

    & a {
      &.disabled {
        pointer-events: none;
        cursor: default;
        opacity: 0.4;
      }

      & svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

export { StyledListWrapper, StyledParticipantItem };
