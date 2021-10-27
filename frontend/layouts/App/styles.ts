/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { keyframes } from 'styled-components';

import { COLOR_NEUTRO_200, COLOR_NEUTRO_700 } from 'ui/settings';
import { space, rems, media } from 'ui/helpers';

const Container = styled.div<{ drawer?: boolean }>`
  background: ${COLOR_NEUTRO_200};
  display: grid;
  grid-template-columns: 1fr ${({ drawer }) => (drawer ? '300px' : 0)};
  grid-template-rows: ${space(14)} 1fr minmax(${space(10)}, auto)};
  gap: 0;
  grid-template-areas: 'Header Aside' 'Main Aside' 'Footer Aside';
  min-height: 100vh;
  overflow: hidden;
  padding: 0 ${space(2)};
  position: relative;
  transition: grid-template-columns 0.25s ease-in-out;

  ${media.min('tablet')`
    grid-template-rows: ${space(10)} 1fr ${space(10)};
    padding: 0 ${space(3)};
  `}
`;

const Header = styled.header`
  align-items: center;
  color: ${COLOR_NEUTRO_700};
  display: flex;
  height: ${space(14)};
  justify-content: space-between;
  grid-area: Header;
  padding: ${space(2)} 0;

  .header-info,
  .header-actions {
    align-items: center;
    display: flex;
  }

  .header-actions {
    justify-content: flex-end;

    .actions {
      margin-right: ${space()};
    }
  }

  .header-info {
    justify-content: flex-start;
    max-width: 45%;
  }

  .header-top {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;

    > * {
      margin: 0;
    }
  }

  ${media.max('tablet')`
    flex-wrap: wrap;
  `}

  ${media.min('tablet')`
    height: ${space(10)};
  `}
`;

const Main = styled.main`
  grid-area: Main;
  position: relative;

  ${media.between('tablet', 'tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(310)};
    }
  `}

  ${media.min('tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(340)};
    }
  `}
`;

const Footer = styled.footer`
  grid-area: Footer;
  position: relative;
  z-index: 9;

  ${media.min('reader')`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: ${space(0.5)};
  `}

  .col-left {
    ${media.min('tablet')`
      align-items: center;
      display: flex;
      grid-column: 1 / 3;
    `}
  }

  .col-mid {
    ${media.min('reader')`
      grid-column: 1 / 7;
    `}

    ${media.min('tablet')`
      grid-column: 3 / 11;
    `}
  }

  .col-right {
    margin: ${space()} 0;
    text-align: center;

    ${media.min('reader')`
      align-items: center;
      grid-column: 7 / span 6;
      display: flex;
      margin: 0;
      text-align: inherit;
    `}

    ${media.min('tablet')`
      grid-column: 11 / span 2;
    `}
  }

  ${media.between('tablet', 'tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(310)};
    }
  `}

  ${media.min('tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(340)};
    }
  `}
`;

const ellipsis = keyframes`
  to {
    width: 15px;
  }
`;

const Overlay = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;

  &::before {
    background: ${COLOR_NEUTRO_700};
    content: '';
    left: 0;
    opacity: 0.6;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .text {
    color: ${COLOR_NEUTRO_200};
    margin-top: ${space(1.5)};
    position: relative;

    &::after {
      animation: ${ellipsis} steps(4, end) 900ms infinite;
      color: currentColor;
      content: '...';
      display: inline-block;
      overflow: hidden;
      position: absolute;
      vertical-align: bottom;
      width: 0px;
    }
  }
`;

export { Container, Footer, Header, Main, Overlay };
