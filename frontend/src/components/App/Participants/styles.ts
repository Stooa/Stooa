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
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_900
} from '@/ui/settings';
import { space, rems, media } from '@/ui/helpers';
import { StyledButtonContext } from '@/components/App/ButtonContextMenu/styles';
import { BODY_MD, BODY_SM, BODY_XS } from '@/ui/Texts';

const ParticipantsDrawer = styled.div`
  background: ${COLOR_NEUTRO_100};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  bottom: 0;
  overflow-y: auto;
  padding: ${space(3)} 0;
  position: fixed;
  right: 0;
  transform: translateX(100%);
  width: 100%;
  will-change: transform;
  z-index: 10;

  & .participant-list > h3,
  & .header,
  & .transcription-wrapper {
    padding: 0 ${space(3)};
  }

  & .participants-wrapper {
    ${media.min('tablet')`
      height: 55%;
    `}
    height: 45%;
  }

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

  & .header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    & h2,
    & .close {
      color: ${COLOR_NEUTRO_600};
    }
  }

  & .participant-list {
    margin: ${space(3)} 0;

    & h3 {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-bottom: ${space(1)};

      svg {
        margin-left: ${space()};
      }
    }
  }

  & .transcription-container {
    min-height: 80px;
    max-height: 55%;

    ${media.min('tablet')`
      max-height: 35%;
    `}

    & hr {
      height: 4px;
      border: none;
      background-color: ${COLOR_NEUTRO_200};
      margin: 0;
      margin-bottom: ${space()};
    }
  }

  & .transcription-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: end;
    position: relative;
    height: 100%;

    & .enable-button {
      padding: ${space(0.5)} ${space(1)};
      background-color: transparent;
      transition: background-color 0.3s ease-out;
      border-radius: ${BORDER_RADIUS};

      &:hover {
        background-color: ${COLOR_NEUTRO_300};
      }
    }

    & .transcription__header {
      display: flex;
      align-items: center;
      gap: ${space(1)};
      margin-bottom: ${space()};
    }
  }
`;

const StyledListItem = styled.li`
  display: grid;
  box-sizing: content-box;
  min-height: 30px;
  grid-template-columns: 4fr minmax(50px, 1fr);
  column-gap: ${space(2)};
  padding: ${space(1)} ${space(3)};
  ${BODY_MD}

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
    justify-content: center;
    height: auto;
    width: auto;

    &:first-child {
      width: 14px;
      height: 14px;
    }
  }

  span.icon {
    opacity: 0.25;
  }

  .social {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${space(2)};

    & a:not(.invalid):hover::after {
      ${BODY_XS}
      content: attr(data-username);
      position: absolute;
      bottom: calc(100% + ${space(0.5)});
      background-color: ${COLOR_NEUTRO_900};
      padding: ${space(0.5)} ${space(1)};
      color: ${COLOR_NEUTRO_100};
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 16ch;
      white-space: nowrap;

      border-radius: 30px;
    }
  }

  &.prefishbowl {
    padding: ${space(2)} ${space(3)};

    & .icon {
      transform: scale(1.2);
    }
  }

  ${media.max('tablet')`
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

  > * {
    position: relative;
    z-index: 1;
  }

  & .transcription-indicator {
    position: relative;
    margin-left: ${space(1)};
    height: 24px;

    & svg {
      & path {
        fill: ${COLOR_NEUTRO_700};
      }
      & rect {
        fill: ${COLOR_NEUTRO_100};
      }
    }
  }

  & .curve {
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

  & .toggle-icon {
    height: ${rems(10)};
    margin-right: ${space()};
    width: ${rems(10)};
  }

  &.active {
    position: relative;

    &::before {
      content: '';
      background: ${COLOR_NEUTRO_100};
      border-top-left-radius: ${rems(8)};
      height: 200%;
      left: 0;
      position: absolute;
      top: 0;
      width: 200%;
      z-index: 0;
    }

    & .curve {
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
