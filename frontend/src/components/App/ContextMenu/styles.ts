/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledContextMenu = styled.ul`
  position: absolute;
  right: calc(100% + ${space(2)});
  top: 0;
`;

export { StyledContextMenu };
