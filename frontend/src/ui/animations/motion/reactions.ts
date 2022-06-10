/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css, keyframes } from 'styled-components';

const FastAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    50% {
      transform: translateY(-150px);
      opacity: 0;
    }

    100% {
      transform: translateY(-150px);
      opacity: 0;
    }

`;

const StandardAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    100% {
      transform: translateY(-150px);
      opacity: 0;
    }

`;

/**
 * Animates the first children with .emoji-fast class
 */
const FloatFast = css`
  & > .emoji-fast {
    animation: ${FastAnimation} 2s ease-out forwards;
  }
`;

/**
 * Animates the first children with .emoji-standard class
 */
const FloatStandard = css`
  & > .emoji-standard {
    animation: ${StandardAnimation} 2s ease-out forwards;
  }
`;

export { FloatFast, FloatStandard };
