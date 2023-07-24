/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_XS } from '@/ui/Texts';
import { TITLE_LG } from '@/ui/Titles';
import { space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_300, COLOR_NEUTRO_400, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledWorldCafeVideos = styled.div<{ maxWidth: string; maxHeight: string }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
  width: 100%;
  height: 80vh;
  overflow-y: auto;
  padding: 1rem;
  border-radius: ${BORDER_RADIUS};

  background-color: ${COLOR_NEUTRO_300};

  & > div {
    flex: 0 1 ${({ maxWidth }) => `calc(${maxWidth} - 1rem)`};
    height: 100%;
    max-height: ${({ maxHeight }) => maxHeight};
    background-color: ${COLOR_NEUTRO_400};
    border-radius: 0.5rem;

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
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 10;

  &.is-local {
    transform: scale(-1, 1);
  }
`;

const StyledParticipantName = styled.div`
  ${BODY_XS};
  position: absolute;
  bottom: 0;
  left: 0;
  padding: ${space(0.5)} ${space()};
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  color: white;

  z-index: 20;
`;

const StyledPartcipantPlaceholder = styled.div`
  position: absolute;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  z-index: 0;

  ${TITLE_LG};
  color: ${COLOR_NEUTRO_700};
`;

export {
  StyledWorldCafeVideos,
  StyledParticipantWorldCafe,
  StyledVideoElement,
  StyledParticipantName,
  StyledPartcipantPlaceholder
};
