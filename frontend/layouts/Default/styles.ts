/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import { space, media } from 'ui/helpers';
import {
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_NEUTRO_900
} from 'ui/settings';

const flexCenter = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  background-color: ${COLOR_NEUTRO_200};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${space(6)} 1fr;
  gap: 0;
  grid-template-areas: 'Header' 'Main';
  min-height: calc(100vh - ${space(6)});
  padding: ${space(3)};
  position: relative;
  transition: grid-template-columns 0.25s ease-in-out;

  &.decorated {
    padding-bottom: ${space(9)};
  }

  ${media.max('phone')`
    min-height: 100vh;
  `}

  ${media.min('tablet')`
    padding: ${space(3)} ${space(6)};

    &.decorated { padding-bottom: ${space(12)}; }
  `}
`;

const Decoration = styled.div`
  &,
  svg {
    bottom: 0;
    left: 0;
    position: absolute;
    pointer-events: none;
    width: 100%;
    z-index: 0;
  }
`;

const Header = styled.header`
  align-items: center;
  color: ${COLOR_NEUTRO_700};
  grid-area: Header;
  display: flex;
  justify-content: space-between;
`;

const Footer = styled.footer`
  align-items: center;
  background-color: ${COLOR_NEUTRO_400};
  color: ${COLOR_NEUTRO_800};
  display: flex;
  height: ${space(6)};
  justify-content: space-between;
  line-height: 1.2;
  padding: 0 ${space(3)};

  ${media.max('phone')`
    height: auto;
    flex-direction: column-reverse;
    padding: ${space(2)} ${space(3)};

    p,
    div {
      display: flex;
      flex-direction: column;
    }

    p,
    div a {
      margin: ${space(1.5)} 0 !important;
    }

    .rrss {
      flex-direction: row;
      margin: ${space(2)} 0;

      a { margin: 0 ${space(1.25)} !important; }
    }
  `}

  ${media.min('tablet')`
    padding: 0 ${space(6)};
  `}

  ${media.min('phone')`
    .legals {
      margin: 0 ${space(2)};
      padding: 0 ${space(2)};
      position: relative;

      &::after,
      &::before {
        background-color: ${COLOR_NEUTRO_800};
        content: '';
        display: block;
        height: 8px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
      }

      &::after { left: 0; }
      &::before { right: 0; }

      a:first-child { margin-right: ${space(2)}; }
    }
  `}

  div {
    align-items: center;
    display: flex;
    justify-content: flex-end;

    a {
      text-decoration: underline;
    }
  }

  .copyright {
    color: ${COLOR_NEUTRO_900};
  }

  .rrss a {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-right: ${space()};
  }
`;

const Main = styled.main<{ center?: boolean }>`
  color: ${COLOR_NEUTRO_700};
  grid-area: Main;
  padding: ${space(2)} 0;
  position: relative;
  text-align: center;
  z-index: 1;

  ${props => (props.center ? flexCenter : '')}
`;

export { Container, Decoration, Header, Main, Footer };
