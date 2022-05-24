/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, rems, space } from '@/ui/helpers';
import { COLOR_GREEN_400, COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const StyledReasonGroup = styled.div`
  display: grid;
  row-gap: ${space(2)};
  margin-bottom: ${space(4)};

  & input {
    display: none;
  }

  & .reason-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${space(2)} ${space()};
    background-color: ${COLOR_NEUTRO_100};
    transition: border 0.2s ease-in-out;
    border: 2px solid ${COLOR_NEUTRO_100};
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);

    border-radius: 5px;

    & svg {
      height: 80px;
      margin-right: ${space(1)};
    }

    &.selected {
      border: 2px solid ${COLOR_GREEN_400};
    }
  }

  ${media.min('tablet')`
    grid-template-columns: 1fr 1fr;
    column-gap: ${space(2)};

    & .reason-card {
      align-items: center;
      flex-direction: column;
      padding: ${space(4)} ${space(2)};
      max-width: ${rems(232)};

      & svg {
        height: 146px;
        margin-right: 0;
        margin-bottom: ${space(2)};
      }
    }
  `}
`;

export { StyledReasonGroup };
