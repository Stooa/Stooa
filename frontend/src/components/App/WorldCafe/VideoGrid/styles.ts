/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { COLOR_NEUTRO_300 } from '@/ui/settings';
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
    flex: 1 1 max(300px, 20%);
    background-color: ${COLOR_NEUTRO_300};
    border-radius: 0.5rem;

    max-height: 80vh;

    &.host {
      background-color: yellow;
      order: -1;
    }
  }
`;

const StyledParticipantWorldCafe = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledVideoElement = styled.video`
  width: 100%;

  &.is-local {
    transform: scale(-1, 1);
  }
`;

const StyledParticipantName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  color: white;

  z-index: 10;
`;

export {
  StyledWorldCafeVideos,
  StyledParticipantWorldCafe,
  StyledVideoElement,
  StyledParticipantName
};
