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
  COLOR_YELLOW_500
} from '@/ui/settings';
import { APP_SM } from '@/ui/Texts';
import { media, space } from '@/ui/helpers';

const SeatsStyled = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;

  .content {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    justify-content: center;
    margin-left: ${space(-0.5)};
    width: calc(100% + ${space()});
  }

  ${media.max('tablet')`
    .content {
      overflow-y: auto;
    }
  `}

  ${media.between('tablet', 'tabletLarge')`
    .drawer-open & .content {
      flex-direction: column;
      flex-wrap: nowrap;
      width: 100%;
    }
  `}
`;

const Free = styled.div`
  color: ${COLOR_NEUTRO_600};
  left: 50%;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;

  svg {
    display: block;
    margin: 0 auto;

    path {
      fill: currentColor;
    }
  }

  .text {
    display: block;
    margin: ${space()} 0 0;
  }
`;

const Seat = styled.div`
  background: ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
  height: calc(33.33333% - ${space()});
  margin: 0 ${space(0.5)} ${space()};
  min-height: 180px;
  overflow: hidden;
  position: relative;
  width: calc(${100 / 2}% - ${space()});

  ${media.min('tablet')`
    height: calc(50% - ${space()});
    width: calc(${100 / 3}% - ${space()});
  `}

  ${media.between('tablet', 'tabletLarge')`
    .drawer-open & {
      width: 100%;
    }
  `}

  .frame,
  &::before {
    border-radius: ${BORDER_RADIUS};
    content: '';
    height: calc(100% + 2px);
    left: -1px;
    pointer-events: none;
    position: absolute;
    top: -1px;
    width: calc(100% + 2px);
    z-index: 5;
  }

  .frame {
    border: 5px solid transparent;
    display: none;
    z-index: 9;
  }

  &::after {
    background: rgba(0, 0, 0, 0.5);
    bottom: -1px;
    color: ${COLOR_NEUTRO_100};
    left: -1px;
    opacity: 0.9;
    padding: ${space()};
    position: absolute;
    z-index: 7;
    ${APP_SM};
  }

  .icon-medium {
    /* background: ${COLOR_RED_100};
    border-radius: 50%; */
    bottom: ${space(0.75)};
    display: none;
    height: ${space(2.5)};
    left: ${space(0.5)};
    position: absolute;
    width: ${space(2.5)};
    z-index: 8;

    path {
      fill: ${COLOR_RED_500};
    }
  }

  .video-placeholder {
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
      padding-left: ${space(7)};
    }

    .icon-medium + .icon-medium {
      left: ${space(3.5)};
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

  &.user-status-interrupted {
    background: ${COLOR_NEUTRO_600};

    .video-placeholder {
      opacity: 1;
    }
  }

  &.user-muted-video {
    &::before {
      background: ${COLOR_NEUTRO_600};
    }

    .video-placeholder {
      opacity: 1;
      z-index: 7;
    }
  }

  &.user-dominant .frame {
    border-color: ${COLOR_YELLOW_500};
    display: block;
  }

  > video {
    height: 100%;
    left: 50%;
    object-fit: cover;
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 3;

    &.is-local {
      transform: translate(-50%, -50%) scaleX(-1);
    }
  }
`;

export { Free, Seat };
export default SeatsStyled;
