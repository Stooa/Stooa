/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

const StyledDots = styled.div`
  display: inline;
  .dot1 {
    animation: visibility 2s linear infinite;
  }

  @keyframes visibility {
    0% {
      opacity: 1;
    }
    65% {
      opacity: 1;
    }
    66% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .dot2 {
    animation: visibility2 2s linear infinite;
  }

  @keyframes visibility2 {
    0% {
      opacity: 0;
    }
    22% {
      opacity: 1;
    }
    65% {
      opacity: 1;
    }
    66% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .dot3 {
    animation: visibility3 2s linear infinite;
  }

  @keyframes visibility3 {
    0% {
      opacity: 0;
    }
    43% {
      opacity: 0;
    }
    44% {
      opacity: 1;
    }
    65% {
      opacity: 1;
    }
    66% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
`;

export { StyledDots };
