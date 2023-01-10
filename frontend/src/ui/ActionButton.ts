/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space } from '@/ui/helpers';

const ActionButton = styled.button<{ disabled?: boolean; active: boolean }>`
  cursor: pointer;
  display: inline-block;
  max-width: ${space(12)};
  text-align: center;
  ${({ active }) => (!active ? 'pointer-events: none;' : '')};

  * ~ & {
    margin: 0 ${space()};
  }

  .button {
    align-items: center;
    border: none;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: flex;
    height: ${space(4.5)};
    justify-content: center;
    margin: 0 auto;
    transition: background 0.1s ease-out;
    width: ${space(4.5)};
  }

  .text {
    line-height: 1.2;
    transition: color 0.1s ease-out;
  }

  & svg {
    height: ${space(3.25)};
    width: ${space(3.25)};

    path {
      fill: currentColor;
      transition: 0.1s ease-out;
    }
  }

  * {
    pointer-events: none;
  }
`;

export default ActionButton;
