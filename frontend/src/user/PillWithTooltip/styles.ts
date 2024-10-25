/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_300, COLOR_NEUTRO_800 } from '@/ui/settings';
import styled from 'styled-components';

const StyledPill = styled.div`
  position: relative;
  background-color: ${COLOR_NEUTRO_300};
  color: ${COLOR_NEUTRO_800};
  padding: ${space(0.25)} ${space(1.25)} ${space(0.15)} ${space(1.25)};
  border-radius: 40px;
  cursor: pointer;
`;

export { StyledPill };
