/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';
import { BODY_LG, BODY_XS } from '@/ui/Texts';
import styled from 'styled-components';

const StyledSummaryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space(4)};
  justify-content: space-between;
  margin-bottom: ${space(4)};
  position: relative;

  &.empty .summary__general,
  &.empty .summary__detail {
    filter: grayscale(1) brightness(0.9) sepia(0.4) hue-rotate(-20deg);
    opacity: 0.5;
  }

  & .empty__wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_NEUTRO_700};
    padding: ${space(2)};
    border-radius: ${BORDER_RADIUS};

    text-align: center;

    z-index: 1;

    ${media.min('tablet')`
      text-align: left;
    `}
  }

  & .summary__general {
    display: flex;
    align-items: center;
    gap: ${space(2)};

    & p {
      width: 120px;
    }
  }

  & .summary__detail {
    ${BODY_XS};

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${space(4)};
    text-align: center;
    color: ${COLOR_NEUTRO_600};

    ${media.max('tablet')`
      flex: 1;
    `}

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
      width: 47px;
      height: 47px;
    }
  }

  & .chart-wrapper {
    width: 67px;
    height: 67px;
  }
`;

export { StyledSummaryWrapper };
