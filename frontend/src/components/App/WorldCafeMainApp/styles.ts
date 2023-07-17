/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

const StyledWorldCafeVideos = styled.div`
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
  gap: 1rem;
  height: 100%;
  width: 100%;

  & > div {
    width: 100%;
    aspect-ratio: 8 / 9;
    background-color: yellowgreen;
    border-radius: 0.5rem;

    &.host {
      background-color: yellow;
      grid-row: 1;
      grid-column: 1;
    }
  }
`;

export { StyledWorldCafeVideos };
