/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import { space, media } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_200, COLOR_NEUTRO_700 } from '@/ui/settings';

const flexCenter = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div<{ blogLayout?: boolean }>`
  background-color: ${COLOR_NEUTRO_200};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${({ blogLayout }) => (blogLayout ? '1fr' : `${space(9)} 1fr`)};
  gap: 0;
  grid-template-areas: 'Header' 'Main';
  min-height: calc(100vh - ${space(9)});
  position: relative;
  transition: grid-template-columns 0.25s ease-in-out;

  &.decorated {
    padding-bottom: ${space(9)};
  }

  ${media.max('phone')`
    min-height: 100vh;
  `}

  ${media.min('tablet')`
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

const Header = styled.header<{ blogLayout?: boolean; whiteLogo?: boolean }>`
  align-items: center;
  color: ${({ whiteLogo }) => (whiteLogo ? COLOR_NEUTRO_100 : COLOR_NEUTRO_700)};
  grid-area: Header;
  display: flex;
  justify-content: space-between;
  padding: ${space(1)} ${space(3)} 0;
  gap: ${space(2)};

  ${media.min('tablet')`
    padding: ${space(3)} ${space(6)} 0;
  `}

  ${({ blogLayout }) =>
    blogLayout &&
    css`
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      padding-top: 1.25rem;
    `}
`;

const Main = styled.main<{
  center?: boolean;
  positionDefault?: boolean;
  blogLayout?: boolean;
  blogPost?: boolean;
}>`
  color: ${COLOR_NEUTRO_700};
  grid-area: Main;
  position: ${props => (props.positionDefault ? 'static' : 'relative')};
  text-align: center;
  z-index: 1;

  padding-bottom: ${({ blogLayout }) => (blogLayout ? '0' : space(12))};
  padding-top: ${({ blogPost }) => (blogPost ? space(12) : '0')};

  ${props => (props.center ? flexCenter : '')}

  ${media.max('tablet')`
    padding-inline: ${({ blogLayout }) => (blogLayout ? 'initial' : space(3))};
  `}
`;

export { Container, Decoration, Header, Main };
