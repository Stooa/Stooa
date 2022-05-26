/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { StatusBox } from '@/components/App/Fishbowl/styles';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';
import { space, rems, media } from '@/ui/helpers';
import { StyledButtonContext } from '@/components/App/ButtonContextMenu/styles';

const ParticipantsDrawer = styled.div`
  background: ${COLOR_NEUTRO_100};
  bottom: 0;
  // height: calc(100% - ${space(14)});
  overflow-y: auto;
  padding: ${space(3)};
  position: fixed;
  right: 0;
  transform: translateX(100%);
  width: 100%;
  will-change: transform;
  z-index: 10;

  ${StyledButtonContext} {
    position: relative;
    & > #context-menu {
      right: calc(100% + ${space()});
    }
  }

  &.active {
    transform: translateX(0);
  }

  ${media.max('tablet')`
    top: 0;
  `}

  ${media.min('tablet')`
    border-top-left-radius: ${rems(8)};
    height: calc(100vh - ${space(10)});
    width: ${rems(320)};
  `}

  ${media.min('tabletLarge')`
    width: ${rems(350)};
  `}

  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    h2,
    .close {
      color: ${COLOR_NEUTRO_700};
      opacity: 0.5;
    }
  }

  .participant-list {
    margin: ${space(3)} 0;

    h3 {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: ${space(2)};

      svg {
        margin-left: ${space()};
      }
    }

    .participant .name {
      display: inline-block;
    }
  }

  .participant {
    display: grid;
    grid-template-columns: 4fr minmax(70px, 1fr);
    column-gap: ${space(2)};
    margin: ${space(2)} 0;

    &:last-child {
      margin-bottom: 0;
    }

    .roles {
      color: ${COLOR_NEUTRO_600};
    }

    .roles,
    .social {
      justify-self: end;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .muted,
    .video-muted {
      display: none;
    }

    &.user-muted-audio {
      .muted {
        display: block;
      }
      .unmuted {
        display: none;
      }
    }

    &.user-muted-video {
      .video-muted {
        display: block;
      }
      .video-unmuted {
        display: none;
      }
    }

    .info {
      display: flex;
      align-items: center;
      width: 100%;
      overflow: hidden;

      *:not(:last-child) {
        margin-right: ${space()};
      }
    }

    .icon {
      align-items: center;
      display: inline-flex;
      height: ${rems(24)};
      justify-content: center;
      margin-left: ${space()};
      padding: ${rems(6)};
      width: ${rems(24)};
    }

    span.icon {
      opacity: 0.25;
    }
  }
`;

const ParticipantsToggle = styled(StatusBox)`
  border-top-left-radius: ${rems(8)};
  overflow: initial;
  padding-right: 0;
  margin-left: ${space(1)};

  &:not(.active) {
    padding-left: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .curve {
    display: none;
    height: auto;
    position: absolute;
    margin-right: 0;
    right: 100%;
    top: 132%;
    width: auto;
    z-index: 0;

    path {
      fill: ${COLOR_NEUTRO_100};
    }
  }

  .toggle-icon {
    height: ${rems(10)};
    margin-right: ${space()};
    width: ${rems(10)};
  }

  &.active {
    background: ${COLOR_NEUTRO_100};
    position: relative;

    &::before {
      content: '';
      background: ${COLOR_NEUTRO_100};
      border-top-left-radius: ${rems(8)};
      height: 200%;
      left: 0;
      position: absolute;
      top: 0;
      width: 160%;
      z-index: 0;
    }

    .curve {
      display: block;
    }
  }
`;

const Icon = styled.button`
  align-items: center;
  display: flex;
  justify-content: center;

  svg {
    height: ${space(4)};
    width: ${space(4)};

    path {
      fill: ${COLOR_NEUTRO_600};
    }
  }

  ${media.min('tablet')`
    display: none;
  `}
`;

export { ParticipantsDrawer, ParticipantsToggle, Icon };
