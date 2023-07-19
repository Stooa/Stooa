/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledWorldCafeHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-area: Header;
  color: ${COLOR_NEUTRO_700};
  z-index: 50;

  min-height: ${space(10)};
`;

export { StyledWorldCafeHeader };
