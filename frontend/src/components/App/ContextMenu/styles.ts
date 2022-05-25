/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const StyledContextMenu = styled.ul`
  position: absolute;
  right: 20px;
  top: 0;
  z-index: 10;

  & > li {
    background-color: ${COLOR_NEUTRO_300};
    padding: ${space(1)} ${space(2)};
  }
`;

export { StyledContextMenu };
