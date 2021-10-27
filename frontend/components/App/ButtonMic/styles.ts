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
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_RED_100,
  COLOR_RED_200,
  COLOR_RED_500,
  COLOR_RED_600
} from 'ui/settings';

const Button = styled(ActionButton)`
  ${({ active }) => (!active ? 'pointer-events: none;' : '')}

  .button {
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_600};
  }

  .text {
    color: ${COLOR_NEUTRO_600};
  }

  &:hover {
    .button {
      background-color: ${COLOR_NEUTRO_400};
      color: ${COLOR_NEUTRO_700};
    }

    .text {
      color: ${COLOR_NEUTRO_600};
    }
  }

  &.muted {
    .button {
      background-color: ${COLOR_RED_100};
      color: ${COLOR_RED_500};
    }

    .text {
      color: ${COLOR_RED_500};
    }

    &:hover {
      .button {
        background-color: ${COLOR_RED_200};
        color: ${COLOR_RED_600};
      }

      .text {
        color: ${COLOR_RED_500};
      }
    }
  }

  &:disabled {
    pointer-events: none;

    .button {
      background-color: ${COLOR_NEUTRO_200};
      color: ${COLOR_NEUTRO_400};
    }

    .text {
      color: ${COLOR_NEUTRO_500};
    }
  }
`;

export default Button;
