/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import ActionButton from 'ui/ActionButton';
import {
  COLOR_GREEN_400,
  COLOR_GREEN_500,
  COLOR_GREEN_600,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_RED_400,
  COLOR_RED_500,
} from 'ui/settings';
import { rems } from 'ui/helpers';

const Button = styled(ActionButton)`
  ${({ active }) => (!active ? 'pointer-events: none;' : '')}

  .button {
    background-color: ${COLOR_GREEN_500};
    color: ${COLOR_NEUTRO_100};
  }

  .text {
    color: ${COLOR_GREEN_500};
  }

  svg {
    height: ${rems(24)};
    width: ${rems(12)};
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
    }

    .text {
      color: ${COLOR_GREEN_400};
    }
  }

  &:disabled {
    pointer-events: none;

    .button {
      background-color: ${COLOR_NEUTRO_400};
      color: ${COLOR_NEUTRO_100};
    }

    .text {
      color: ${COLOR_NEUTRO_500};
    }
  }
`;

export default Button;
