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

const StyledButtonFeedback = styled.button`
  padding: 1rem;
  border: 1px solid #e5e5e5;
`;

const StyledFeedbackWrapper = styled.div`
  position: absolute;
  bottom: ${space()};
  right: ${space(2)};
  z-index: 20;

  &.drawer-opened {
    right: ${space(46)};
  }
`;

export { StyledButtonFeedback, StyledFeedbackWrapper };
