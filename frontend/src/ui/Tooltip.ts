/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_700 } from '@/ui/settings';
import { space } from './helpers';

const StyledTooltip = styled.div`
  color: ${COLOR_NEUTRO_100};
  background-color: ${COLOR_NEUTRO_700};
  padding: ${space(2)} ${space(4)};
`;

export { StyledTooltip };
