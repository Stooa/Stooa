/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import ActionButton from '@/ui/ActionButton';
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700
} from '@/ui/settings';
import { media, rems, space } from '@/ui/helpers';
import { BODY_SM, BODY_XS } from '@/ui/Texts';
import { scrolllbarStyle } from '@/ui/Scrollbar';

interface SelectorProps {
  bottom?: boolean;
  top?: boolean;
}

const Button = styled(ActionButton)`
  .button {
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_600};
  }

  .text {
    color: ${COLOR_NEUTRO_600};

    ${BODY_XS}
    line-height: 1.5;

    ${media.min('tablet')`
      ${BODY_SM}
    `}
  }

  &:hover {
    .button {
      background-color: ${COLOR_NEUTRO_400};
      color: ${COLOR_NEUTRO_700};
    }

    .text {
      color: ${COLOR_NEUTRO_600};
    }
  }

  &.active .button {
    background-color: ${COLOR_NEUTRO_400};
    color: ${COLOR_NEUTRO_700};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;

  ${media.min('tablet')`
    position: relative;
  `}
`;

const Selector = styled.div`
  position: absolute;

  ${({ bottom }: SelectorProps) =>
    bottom &&
    `top: calc(100% + ${space()});
      left: 50%;
      transform: translateX(-50%);
    `}
  ${({ top }: SelectorProps) =>
    top &&
    `bottom: calc(55% + ${space()});
      right: 0;
  `};

  max-height: 47vh;
  width: ${rems(280)};
  background: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_700};
  border-radius: ${BORDER_RADIUS};
  overflow-y: auto;
  z-index: 21;

  ${scrolllbarStyle}

  & .recording-button {
    position: sticky;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    width: 100%;
    padding: ${space()} ${space(2)};

    color: ${COLOR_NEUTRO_700};
    background-color: ${COLOR_NEUTRO_100};
    transition: background-color 0.2s ease-in-out;

    border-bottom: 1px solid ${COLOR_NEUTRO_600};

    text-align: left;

    & svg {
      margin-right: ${space()};
    }

    &:hover {
      background-color: ${COLOR_NEUTRO_300};
    }
  }

  ${media.min('tablet')`
    top: initial;
    bottom: calc(100% + ${space()});
    max-height: ${rems(430)};
  `}
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid ${COLOR_NEUTRO_700};
  }

  .title {
    align-items: center;
    color: ${COLOR_NEUTRO_700};
    display: inline-flex;
    padding: ${space()} ${space(2)};

    svg {
      height: ${space(3)};
      margin-right: ${space()};
      width: ${space(3)};
      & path {
        fill: currentColor;
      }
    }
  }
`;

const PermissionsNotGranted = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: ${space(1.5)};
  padding: ${space()} ${space(2)} ${space()} ${space(2.5)};
  color: ${COLOR_NEUTRO_600};

  svg {
    height: ${space(2)};
    width: ${space(2)};
  }
`;

const Item = styled.button<{ selected: boolean }>`
  align-items: center;
  color: ${COLOR_NEUTRO_600};
  display: inline-flex;
  padding: ${space()} ${space(2)} ${space()} ${space(2.5)};
  text-align: left;
  width: 100%;

  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  svg {
    opacity: ${({ selected }) => (selected ? 1 : 0)};
    height: ${space(2)};
    margin-right: ${space()};
    min-width: ${space(2)};
    width: ${space(2)};
  }

  &:hover {
    background: ${COLOR_NEUTRO_300};
  }

  * {
    pointer-events: none;
  }
`;

const HelpTextWrapper = styled.div`
  color: ${COLOR_NEUTRO_600};
  font-size: 0.75rem;

  padding: ${space()} ${space(2)} ${space()} ${space(2.5)};

  button {
    display: flex;
    opacity: 0.7;
    align-items: center;

    width: 100%;
    height: 1rem;

    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }

    span {
      margin-left: ${space(1)};
    }
  }
`;

export { Button, Container, Item, List, Selector, HelpTextWrapper, PermissionsNotGranted };
