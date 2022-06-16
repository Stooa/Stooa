/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css, keyframes } from 'styled-components';

const FastReceivedAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    60% {
      transform: translateY(-45vh);
      opacity: 0;
    }

    100% {
      transform: translateY(-45vh);
      opacity: 0;
    }

`;

const StandardReceivedAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    100% {
      transform: translateY(-40vh);
      opacity: 0;
    }

`;
const FastAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    60% {
      transform: translateY(-180px);
      opacity: 0;
    }

    100% {
      transform: translateY(-180px);
      opacity: 0;
    }

`;

const StandardAnimation = keyframes`
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    100% {
      transform: translateY(-180px);
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
/**
 * Animates the first children with .emoji-fast class
 */
const FloatReceivedFast = css`
  & > .emoji-fast {
    animation: ${FastReceivedAnimation} 3.33s ease-out forwards;
  }
`;

/**
 * Animates the first children with .emoji-standard class
 */
const FloatReceivedStandard = css`
  & > .emoji-standard {
    animation: ${StandardReceivedAnimation} 3.33s ease-out forwards;
  }
`;

export { FloatFast, FloatStandard, FloatReceivedFast, FloatReceivedStandard };
