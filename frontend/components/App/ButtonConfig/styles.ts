/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import ActionButton from 'ui/ActionButton';
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
} from 'ui/settings';
import { rems, space } from 'ui/helpers';

const Button = styled(ActionButton)`
  .button {
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_600};
  }

  .text {
    color: ${COLOR_NEUTRO_600};
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
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const Selector = styled.div`
  background: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_600};
  border-radius: ${BORDER_RADIUS};
  bottom: calc(100% + ${space()});
  left: 50%;
  margin-left: ${rems(-140)};
  max-height: ${rems(350)};
  overflow-y: auto;
  position: absolute;
  width: ${rems(280)};
  z-index: 21;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid ${COLOR_NEUTRO_600};
  }

  .title {
    align-items: center;
    color: ${COLOR_NEUTRO_600};
    display: inline-flex;
    padding: ${space()} ${space(2)};

    svg {
      height: ${space(3)};
      margin-right: ${space()};
      width: ${space(3)};
    }
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

export { Button, Container, Item, List, Selector, HelpTextWrapper };
