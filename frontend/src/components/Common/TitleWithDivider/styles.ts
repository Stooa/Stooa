/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_500 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTitleWithDivider = styled.p<{ regularWeight: boolean }>`
  display: flex;
  align-items: center;
  gap: ${space(2)};
  position: relative;
  width: 100%;
  font-weight: ${({ regularWeight }) => (regularWeight ? 'normal' : '500')};

  & span {
    flex-grow: 1;
    position: inline-block;
    vertical-align: middle;
    height: 1px;
    width: auto;
    background-color: ${COLOR_NEUTRO_500};
  }
`;

export { StyledTitleWithDivider };
