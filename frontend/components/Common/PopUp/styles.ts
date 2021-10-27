/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { BORDER_RADIUS, COLOR_NEUTRO_900, COLOR_NEUTRO_100 } from 'ui/settings';
import { hexToRgb, space, rems } from 'ui/helpers';

const bg = hexToRgb(COLOR_NEUTRO_900);

const Container = styled.div<{ open: boolean }>`
  background: rgba(${bg.r}, ${bg.g}, ${bg.b}, 0.9);
  height: 100vh;
  opacity: ${({ open }) => (open ? 1 : 0)};
  position: absolute;
  transition: opacity 0.25s ease-in-out;
  width: 100%;
  pointer-events: ${({ open }) => (open ? 'initial' : 'none')};
  z-index: 9;
`;

const Content = styled.div`
  background: ${COLOR_NEUTRO_100};
  border-radius: ${BORDER_RADIUS};
  color: ${COLOR_NEUTRO_900};
  left: 50%;
  max-width: ${rems(340)};
  padding: ${space(4)} ${space(3)};
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 1;
`;

export { Container, Content };
