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

const StyledTimeDisplay = styled.span`
  margin-left: ${space(0.5)};
  width: 5ch;

  &.larger {
    width: 6ch;
  }
`;
export { StyledTimeDisplay };
