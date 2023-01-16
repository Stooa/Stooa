/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, rems, hexToRgb, media } from '@/ui/helpers';
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_900
} from '@/ui/settings';
import { TYPOGRAPHY_SIZES } from './Texts';

const N900_RGB = hexToRgb(COLOR_NEUTRO_900);

const Modal = styled.div`
  align-items: center;
  background-color: rgba(${N900_RGB.r}, ${N900_RGB.g}, ${N900_RGB.b}, 0.8);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  padding: ${space(2)};
  position: fixed;
  right: 0;
  top: 0;
  z-index: 11;
  overflow: scroll;

  ${media.min('tablet')`
    overflow: unset;
  `}

  & .content {
    background-color: ${COLOR_NEUTRO_200};
    color: ${COLOR_NEUTRO_700};
    border-radius: ${BORDER_RADIUS};
    max-width: ${rems(422)};
    padding: ${space(6)} ${space(4)};
    position: relative;
    text-align: center;

    & .friend-image {
      margin-bottom: ${space(2)};
      margin-inline: auto;
    }

    &.white {
      background-color: ${COLOR_NEUTRO_100};
    }
  }

  .close {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: ${space(2)};
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;

    svg {
      height: ${space(2)};
      width: ${space(2)};

      path {
        fill: currentColor;
      }
    }
  }

  .description {
    margin-top: ${space(2)};

    & a {
      --font-size: ${TYPOGRAPHY_SIZES.body_md.fontSize};
    }
  }

  .modal-footer {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: ${space(3)};

    > *:last-child {
      margin-top: ${space(2)};
    }
  }
`;

export default Modal;
