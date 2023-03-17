/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_400, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';

const Container = styled.footer`
  background-color: ${COLOR_NEUTRO_400};
  color: ${COLOR_NEUTRO_700};
  line-height: 1.2;
  min-height: ${space(37.5)};
  padding: ${space(5)} ${space(3)};

  ${media.min('tablet')`
    padding: ${space(5)} ${space(3)} ${space()};
  `};

  .logo {
    display: block;
    margin: 0 0 ${space(4)};
    min-width: 20%;
  }
`;

const Nav = styled.nav`
  &.social {
    ${media.between('tablet', 'desktop')`
      margin: ${space(2)} 0 0;
      width: 100%;
    `};
  }
`;

const NavTitle = styled.div`
  margin-top: 9px;
  margin-bottom: ${space(2)};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0 0 ${space(3)};
  padding: 0;

  ${media.min('tablet')`
    margin: 0;
  `};

  li {
    margin: 0 0 ${space(2)};
  }

  a {
    text-decoration: underline;
  }
`;

const FooterNav = styled.section`
  & .logo {
    margin-bottom: ${space(2)};
  }

  ${media.min('tablet')`
    align-items: flex-start;
    display: flex;
    gap: 0 ${space(4)};
    flex-wrap: wrap;
    justify-content: space-between;
    padding: ${space(2)} 0 0;
  `};
`;

const FooterCopyright = styled.section`
  border-top: 1px solid ${COLOR_NEUTRO_600};
  margin: ${space(3)} 0 0;
  padding: ${space()} 0 0;

  ${media.min('tablet')`
    align-items: center;
    display: flex;
    justify-content: flex-end;
  `};

  .copyright {
    margin: ${space(3)} 0 ${space()};

    ${media.min('tablet')`
      border-right: 1px solid currentColor;
      padding-right: ${space()};
      margin: 0 ${space()} 0 0;
    `};
  }
`;

export { Container, FooterCopyright, FooterNav, Nav, NavList, NavTitle };
