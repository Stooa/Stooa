/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

const StyledWorldCafeVideos = styled.div<{ quantity: number }>`
  /* display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(min(25rem, 100%), 1fr)); */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  width: 100%;

  & > div {
    width: ${({ quantity }) =>
      quantity > 6 ? `calc(100% / ${6} - 1rem)` : `calc(100% / ${quantity / 2} - 1rem)`};
    aspect-ratio: 7/5;
    background-color: yellowgreen;
    border-radius: 0.5rem;

    &.host {
      background-color: yellow;
      order: -1;
      /* grid-row: 1;
      grid-column: 1; */
    }
  }
`;

export { StyledWorldCafeVideos };
