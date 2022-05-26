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

export const StyledButton = styled.button`
  display: flex;
  align-items: center;

  & svg {
    margin-right: ${space(1)};
  }
`;
