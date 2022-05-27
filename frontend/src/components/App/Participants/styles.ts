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
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700
} from '@/ui/settings';
import { space, rems, media } from '@/ui/helpers';
import { StyledButtonContext } from '@/components/App/ButtonContextMenu/styles';
import { BODY_MD, BODY_SM } from '@/ui/Texts';

const ParticipantsDrawer = styled.div`
  background: ${COLOR_NEUTRO_100};
  bottom: 0;
  /* height: calc(100% - ${space(14)}); */
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

    & > button {
      opacity: 1;
      background-color: ${COLOR_NEUTRO_300};
      & > svg path {
        fill: ${COLOR_NEUTRO_700};
      }

      &:hover {
        background-color: ${COLOR_NEUTRO_400};
      }
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
  }
`;

const StyledListItem = styled.li`
  display: grid;
  min-height: 30px;
  grid-template-columns: 4fr minmax(100px, 1fr);
  column-gap: ${space(2)};
  padding: ${space()} 0;
  ${BODY_MD}

  &:not(:last-child) {
    margin-bottom: ${space()};
  }

  .roles {
    color: ${COLOR_NEUTRO_600};
    margin-left: ${space()};
  }

  .name {
    display: inline-block;
    max-width: 61%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;

    * :not(:last-child) {
      margin-right: ${space()};
    }
  }

  .icon {
    box-sizing: content-box;
    align-items: center;
    display: inline-flex;
    height: 16px;
    justify-content: center;
    width: 16px;
  }

  span.icon {
    opacity: 0.25;
  }

  .social {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & > *:not(:last-child) {
      margin-right: ${space(2)};
    }
  }

  ${media.max('tablet')`
    width: calc(100% + ${space(6)});
    transform: translateX(${space(-3)});
    padding: ${space()} ${space(2)};

    &:hover {
      background-color: ${COLOR_NEUTRO_200};
    }
  `}

  ${media.min('tablet')`
    ${BODY_SM}
  `}
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

export { ParticipantsDrawer, ParticipantsToggle, Icon, StyledListItem };
