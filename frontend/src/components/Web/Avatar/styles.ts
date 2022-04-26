/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { media, space, rems } from '@/ui/helpers';
import { COLOR_NEUTRO_200, COLOR_NEUTRO_400, COLOR_NEUTRO_700, BORDER_RADIUS } from '@/ui/settings';

const Avatar = styled.div`
  color: ${COLOR_NEUTRO_700};
  position: relative;

  svg path {
    fill: currentColor;
  }

  .avatar {
    align-items: center;
    border-radius: ${space(3)};
    border: 1px solid transparent;
    display: flex;
    justify-content: flex-start;
    line-height: 1.15;
    padding: ${space(1.1)} ${space(3)} ${space(0.9)};
    text-align: left;
    will-change: background, border;

    span {
      margin: 0 ${space()};
    }

    svg {
      height: 20px;
      min-width: 21px;
      width: 21px;
    }

    &.active {
      background-color: ${COLOR_NEUTRO_400};
      border-color: currentColor;
    }
  }

  ${media.max('tablet')`
    max-width: 85%;
  `}

  ${media.min('tablet')`
    .avatar {
      transition: .1s ease-out;

      &:hover {
        background-color: ${COLOR_NEUTRO_400};
      }
    }
  `}
`;

const Dropdown = styled.div`
  background: ${COLOR_NEUTRO_200};
  border: 1px solid currentColor;
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  margin-top: ${space(2.25)};
  overflow: hidden;
  position: absolute;
  min-width: ${rems(195)};
  right: 0;
  will-change: background;
  z-index: 3;

  .item {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    padding: ${space()} ${space(2)};
    width: 100%;

    svg {
      height: ${rems(24)};
      width: ${rems(24)};
    }

    &:hover {
      background-color: ${COLOR_NEUTRO_400};
    }

    span {
      margin: 0 ${space()};
    }

    &:hover {
      color: inherit;
    }

    &:focus {
      color: inherit;
    }
  }
`;

export { Avatar, Dropdown };
