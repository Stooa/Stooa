/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import {
  BORDER_RADIUS,
  COLOR_RED_100,
  COLOR_RED_500,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_YELLOW_500,
  COLOR_NEUTRO_300
} from '@/ui/settings';
import { media, space } from '@/ui/helpers';
import { BODY_XS } from '@/ui/Texts';
import { StyledButtonContext } from '../ButtonContextMenu/styles';

const Free = styled.div`
  position: absolute;
  color: ${COLOR_NEUTRO_600};
  top: 50%;
  left: 50%;
  padding: 0 ${space(2)};
  pointer-events: none;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  z-index: 0;

  svg {
    display: block;
    margin: 0 auto;
    transform: scale(0.75) translateY(0.5rem);

    ${media.min('tablet')`
      transform: scale(1) translateY(0);
    `}

    path {
      fill: currentColor;
    }
  }

  .text {
    display: block;
    font-weight: 400;
    margin: ${space()} 0 0;
  }
`;

const Seat = styled.div`
  background: ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
  height: 100%;
  position: relative;
  grid-column-end: span 2;
  transition: background 0.35s ease-in-out;
  will-change: background;

  ${StyledButtonContext} {
    position: absolute;
    top: ${space()};
    right: ${space()};
    z-index: 6;

    & .context-button {
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }

    ${media.min('tablet')`
        & .context-button {
          opacity: 0;
          transition: opacity 0.2s ease-in;
        }
    `}
  }

  &:hover .context-button {
    opacity: 1;
    transition: opacity 0.2s ease-out;
  }

  .seat-wrapper {
    transition: opacity 0.35s ease-in-out;
  }

  ${media.between('tablet', 'tabletLarge')`
    .drawer-open & {
      width: 100%;
    }
  `}

  .frame {
    position: absolute;
    border-radius: ${BORDER_RADIUS};
    border: 4px solid transparent;
    height: calc(100% + 2px);
    width: calc(100% + 2px);
    display: none;
    z-index: 5;
  }

  &::after {
    background: rgba(0, 0, 0, 0.5);
    bottom: 0;
    border-radius: 0 0 0 ${BORDER_RADIUS};
    color: ${COLOR_NEUTRO_100};
    left: 0;
    opacity: 0.8;
    backdrop-filter: blur(64px);
    text-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.25);
    padding: ${space(1.25)};
    position: absolute;
    z-index: 4;
    ${BODY_XS};
  }

  .icon-medium {
    background: ${COLOR_RED_100};
    border-radius: 50%;
    bottom: ${space(1)};
    display: none;
    height: ${space(2.5)};
    left: ${space(1)};
    position: absolute;
    width: ${space(2.5)};
    z-index: 5;

    path {
      fill: ${COLOR_RED_500};
    }
  }

  &:not(.user-joined) .video-placeholder {
    opacity: 0;
  }

  &.user-muted-audio,
  &.user-muted-video {
    &::after {
      padding-left: ${space(4)};
    }
  }

  &.user-muted-audio.user-muted-video {
    &::after {
      padding-left: ${space(7.5)};
    }

    .icon-medium + .icon-medium {
      left: ${space(4)};
    }
  }

  &.user-muted-audio .icon-audio {
    display: block;
  }

  &.user-muted-video .icon-video {
    display: block;
  }

  &.user-joined {
    ${Free} {
      display: none;
    }

    &::after {
      content: attr(data-username);
    }
  }

  .video-placeholder {
    z-index: 1;
    border-radius: ${BORDER_RADIUS};
  }

  &.user-status-interrupted {
    background: ${COLOR_NEUTRO_600};

    .video-placeholder {
      opacity: 1;
    }
  }

  &.user-muted-video,
  &.no-video-permission {
    &::before {
      background: ${COLOR_NEUTRO_600};
    }

    .video-placeholder {
      opacity: 1;
    }
  }

  &.user-dominant .frame {
    border-color: ${COLOR_YELLOW_500};
    display: block;
  }

  &.user-muted-video > .video-wrapper {
    z-index: 0;
  }

  & > .video-wrapper video {
    height: 100%;
    left: 50%;
    object-fit: cover;
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 2;

    &.is-local {
      transform: translate(-50%, -50%) scaleX(-1);
    }
  }
`;

const SeatsStyled = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;

  & > .content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${space(1)};
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    & #share {
      display: none;
    }

    &.sharing {
      & #share {
        display: block;
        width: 100%;
        height: 100%;

        & .share-video-wrapper.moderator {
          background-color: #000;

          & video {
            opacity: 0.5;
          }
        }

        & video {
          width: 100%;
          height: auto;
          object-fit: cover;
          max-height: 550px;
        }
      }
    }

    &.not-started div[id^='seat'] {
      background: ${COLOR_NEUTRO_300};
      .seat-wrapper {
        opacity: 0.3;
      }
    }

    ${media.min('tablet')`
      padding-bottom: ${space()};
      grid-template-columns: repeat(6, 1fr);

      #seat-4 {
        grid-column: 2 / 4;
      }

      &.sharing {
        grid-template-columns: 4fr 1fr 1fr;
        grid-template-rows: 2fr 1fr 1fr;

        ${Seat} {
          grid-column: span 1;
        }

        #seat-1 {
          grid-column: span 2;
        }

        #seat-4 {
          grid-column:initial;
        }

        & #share {
          height: 100%;
          display: flex;
          align-items: center;
          background-color: ${COLOR_NEUTRO_600};
          border-radius: ${BORDER_RADIUS};

          grid-column: 1;
          grid-row: span 3;

          & .share-video-wrapper {
            border-radius: ${BORDER_RADIUS};
            overflow: hidden;
            line-height: 0;
          }

          & video {
            width: 100%;
            height: auto;
            object-fit: contain;
            max-height: 850px;
          }
        }
      }
    `}
  }

  ${media.between('tablet', 'tabletLarge')`
    .drawer-open & .content {
      flex-direction: column;
      flex-wrap: nowrap;
      width: 100%;
    }
  `}
`;

const VideoWrapper = styled.div`
  border-radius: ${BORDER_RADIUS};
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export { Free, Seat, VideoWrapper };
export default SeatsStyled;
