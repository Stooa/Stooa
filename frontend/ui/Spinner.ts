/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { keyframes } from 'styled-components';

import { space } from 'ui/helpers';
import SVG from 'ui/svg/spinner.svg';

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const Spinner = styled(SVG)`
  animation: ${rotate} 2s linear infinite;
  height: 16px;
  margin: 0 0 0 ${space()};
  width: 16px;

  & circle {
    animation: ${dash} 1.5s ease-in-out infinite;
    stroke: currentColor;
    stroke-linecap: round;
  }
`;

export default Spinner;
