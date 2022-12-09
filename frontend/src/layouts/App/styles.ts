/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { keyframes } from 'styled-components';

import { COLOR_NEUTRO_200, COLOR_NEUTRO_700 } from '@/ui/settings';
import { space, rems, media } from '@/ui/helpers';

const Container = styled.div<{ drawer?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr ${({ drawer }) => (drawer ? '300px' : 0)};
  grid-template-rows: auto 1fr minmax(${space(10)}, auto);
  gap: 0;
  grid-template-areas: 'Header Aside' 'Main Aside' 'Footer Aside';
  min-height: 100vh;
  overflow: hidden;
  background: ${COLOR_NEUTRO_200};
  transition: grid-template-columns 0.25s ease-in-out;

  & > header {
    padding: ${space(2)} ${space(2)} 0 ${space(2)};
  }

  & > main {
    padding-left: ${space(2)};
    padding-right: ${space(2)};
  }

  ${media.min('tablet')`
  grid-template-rows: ${space(10)} 1fr ${space(10)};

  & > header {
    padding: ${space(3)} ${space(3)} 0 ${space(3)};
  }

  & > main {
      padding-left: ${space(3)};
      padding-right: ${space(3)};
    }
  `}

  &.prefishbowl {
    display: grid;
    grid-template-columns: 1fr ${({ drawer }) => (drawer ? '300px' : 0)};
    grid-template-rows: auto 1fr minmax(${space(10)}, auto);
    gap: 0;
    grid-template-areas: 'Header Aside' 'Main Aside' 'Footer Aside';
  }
`;

const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-area: Header;
  padding-top: ${space(2)};
  color: ${COLOR_NEUTRO_700};

  ${media.max('tablet')`

      min-height: ${space(16)};

    &.prefishbowl{
      min-height: ${space(12)};
    }
  `}

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

    ${media.max('tablet')`
      margin-bottom: 0.5rem;
    `}

    .title {
      max-width: 45ch;
      overflow: hidden;
      ${media.min('tablet')`
        max-width: ${rems(310)};
      `}
    }
  }

  .header-top {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr auto;
    justify-items: space-between;
    width: 100%;

    .header-logo {
      margin-right: ${space(2)};
    }

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
      padding-right: ${rems(344)};
    }
  `}

  ${media.min('tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(375)};
    }
  `}
`;

const Footer = styled.footer`
  grid-area: Footer;
  position: relative;
  z-index: 9;

  ${media.min('tablet')`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-gap: ${space(0.5)};
  `}

  .col-left {
    ${media.min('tablet')`
      align-items: center;
      display: flex;
      padding-left: ${space(2)};
    `}
  }

  .moderator-actions {
    display: grid;
    place-content: center;
    margin: ${space(2)} 0;

    ${media.min('reader')`
      grid-row: 1;
      grid-column: 3 / 4;
    `}
  }

  & > .user-actions {
    text-align: center;

    ${media.min('tablet')`
      align-items: center;
      grid-column: 2/3;
      display: flex;
      margin: 0;
    `}
  }

  ${media.between('tablet', 'tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(344)};
    }
  `}

  ${media.min('tabletLarge')`
    &.drawer-open {
      padding-right: ${rems(375)};
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
