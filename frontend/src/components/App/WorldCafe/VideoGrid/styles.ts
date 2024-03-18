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
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_RED_100,
  COLOR_RED_500
} from '@/ui/settings';
import styled from 'styled-components';

const StyledVideoGridWrapper = styled.div`
  padding: 1rem;
  border-radius: ${BORDER_RADIUS};
  height: 80vh;

  background-color: ${COLOR_NEUTRO_100};
`;

const StyledVideoGridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledParticipantCounter = styled.div`
  display: flex;
  align-items: center;
  gap: ${space(0.5)};
  color: ${COLOR_NEUTRO_800};
`;

const StyledVideoGridTitle = styled.h1`
  color: ${COLOR_NEUTRO_800};
  margin-bottom: 1rem;
`;

const StyledWorldCafeVideos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
  width: 100%;

  overflow-y: auto;
`;

const StyledParticipantWorldCafe = styled.div<{
  isVideoMuted: boolean;
  maxWidth: string;
  maxHeight: string;
  isModerator: boolean;
}>`
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;

  flex: 0 1 ${({ maxWidth }) => `calc(${maxWidth} - 1rem)`};
  height: 100%;
  max-height: ${({ maxHeight }) => maxHeight};
  background-color: ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};

  ${({ isVideoMuted }) =>
    !isVideoMuted &&
    `
    order: -1;
  `}

  ${({ isModerator }) =>
    isModerator &&
    `
    order: -2;
  `}

  & :has(.is-local) {
    order: -2;
  }
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
  display: flex;
  gap: ${space(0.5)};
  align-items: center;

  ${BODY_XS};
  position: absolute;
  bottom: 0;
  left: 0;

  padding: ${space(0.5)} ${space()};
  background-color: rgba(0, 0, 0, 0.5);

  color: white;

  z-index: 20;
`;

const StyledMutedWrapper = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  background-color: ${COLOR_RED_100};
  border: 1px solid ${COLOR_RED_500};
  border-radius: 50%;

  & > svg {
    z-index: 1;
    width: 96%;
    height: 96%;
  }
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
  StyledPartcipantPlaceholder,
  StyledMutedWrapper,
  StyledVideoGridWrapper,
  StyledVideoGridTitle,
  StyledVideoGridHeader,
  StyledParticipantCounter
};
