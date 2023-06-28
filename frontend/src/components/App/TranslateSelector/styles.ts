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

const StyledSelectorWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  gap: ${space(1)};
  align-items: center;
  justify-content: space-between;

  & input {
    margin-inline-end: ${space(1)};
  }

  & .info {
    position: relative;
  }

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    pointer-events: none;
  `}

  & span {
    margin-right: ${space(1)};
  }
`;

export { StyledSelectorWrapper };
