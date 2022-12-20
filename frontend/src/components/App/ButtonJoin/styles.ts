/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import ActionButton from '@/ui/ActionButton';
import {
  COLOR_NEUTRO_300,
  COLOR_GREEN_400,
  COLOR_GREEN_500,
  COLOR_GREEN_600,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_RED_400,
  COLOR_RED_500,
  COLOR_RED_600
} from '@/ui/settings';
import { media, rems } from '@/ui/helpers';
import { BODY_SM, BODY_XS } from '@/ui/Texts';

const StyledButton = styled(ActionButton)`
  ${({ active }) => (!active ? 'pointer-events: none;' : '')}

  .button {
    position: relative;
    background-color: ${COLOR_GREEN_500};
    color: ${COLOR_NEUTRO_100};
    border: none;

    & > svg {
      height: ${rems(24)};
      width: ${rems(12)};
    }
  }

  .alert {
    position: absolute;
    top: 0;
    right: -50%;
    transition: transform 0.2s ease-in;

    svg path:first-child {
      fill: ${COLOR_RED_600};
      transition: fill 0.1s ease-out;
    }
  }

  .text {
    color: ${COLOR_GREEN_500};
    padding-top: 2px;

    ${BODY_XS}
    line-height: 1.1;

    ${media.min('tablet')`
      ${BODY_SM}
      line-height: 1.1;
    `}
  }

  * {
    pointer-events: none;
  }

  &.joined {
    .button {
      background-color: ${COLOR_RED_500};
      color: ${COLOR_NEUTRO_200};
    }

    .text {
      color: ${COLOR_RED_500};
    }

    &:hover {
      .button {
        background-color: ${COLOR_RED_400};
        color: ${COLOR_NEUTRO_200};
      }

      .text {
        color: ${COLOR_RED_400};
      }
    }
  }

  &:focus {
    outline: none;

    .button {
      background-color: ${COLOR_GREEN_600};
      color: ${COLOR_NEUTRO_100};
    }

    .text {
      color: ${COLOR_GREEN_600};
    }
  }

  &:hover {
    .button {
      background-color: ${COLOR_GREEN_400};
      color: ${COLOR_NEUTRO_100};

      .alert {
        transition: transform 0.2s ease-out;
        transform: translateY(-2px);

        svg:first-child {
          fill: ${COLOR_RED_500};
        }
      }
    }

    .text {
      color: ${COLOR_GREEN_400};
    }
  }

  &:disabled {
    pointer-events: none;

    .button {
      background-color: ${COLOR_NEUTRO_300};
      border-color: ${COLOR_NEUTRO_400};
      color: ${COLOR_NEUTRO_200};
    }

    .alert {
      svg path:first-child {
        fill: ${COLOR_NEUTRO_400};
        transition: fill 0.1s ease-out;
      }
    }

    .text {
      color: ${COLOR_NEUTRO_500};
    }
  }
`;

export default StyledButton;
