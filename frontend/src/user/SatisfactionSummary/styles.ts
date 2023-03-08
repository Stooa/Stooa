/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_600 } from '@/ui/settings';
import { BODY_LG, BODY_XS } from '@/ui/Texts';
import styled from 'styled-components';

const StyledSummaryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(4)};

  & .summary__general {
    display: flex;
    align-items: center;
    gap: ${space(2)};
  }

  & .summary__detail {
    ${BODY_XS};

    display: flex;
    gap: ${space(4)};
    text-align: center;
    color: ${COLOR_NEUTRO_600};

    & > div {
      position: relative;

      &:last-child {
        margin-right: 12px;
      }

      & span {
        ${BODY_LG};
        position: absolute;
        top: -8px;
        right: -8px;
      }

      &:last-child {
        margin-right: 12px;
        & span {
          right: -12px;
        }
      }

      & p {
        font-weight: 500;
      }
    }

    & svg {
      width: 67px;
      height: 67px;
    }
  }

  & .chart-wrapper {
    width: 67px;
    height: 67px;
  }
`;

export { StyledSummaryWrapper };
