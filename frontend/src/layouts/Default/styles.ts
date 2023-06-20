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
import { COLOR_NEUTRO_200, COLOR_NEUTRO_700 } from '@/ui/settings';

const flexColumn = css`
  display: flex;
  flex-direction: column;
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

const Main = styled.main<{
  horizontalAlign?: 'flex-start' | 'center' | 'flex-end';
  verticalAlign?: 'flex-start' | 'center' | 'flex-end';
}>`
  color: ${COLOR_NEUTRO_700};
  grid-area: Main;
  padding: ${space(2)} 0;
  position: relative;
  text-align: center;
  z-index: 1;

  ${props => (props.horizontalAlign || props.verticalAlign ? flexColumn : '')}

  ${props =>
    props.horizontalAlign &&
    css`
      align-items: ${props.horizontalAlign};
    `}
  ${props =>
    props.verticalAlign &&
    css`
      justify-content: ${props.verticalAlign};
    `}
`;

export { Container, Decoration, Header, Main };
