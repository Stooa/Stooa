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

const StyledTranscriptionWrapper = styled.div<{ location?: 'modal' | 'default' }>`
  display: flex;
  position: relative;
  gap: ${space(3)};
  align-items: center;
  justify-content: ${({ location }) => (location === 'modal' ? '' : 'space-between')};
  margin-bottom: ${space(1)};

  & input {
    margin-inline-end: ${space(1)};
  }

  & label {
    display: flex;
    align-items: center;
    gap: ${space(1)};
  }

  & .info {
    position: relative;
    height: 16px;
  }

  & div.disabled {
    opacity: 0.5;
  }

  & .info {
    margin-right: ${space(1)};
  }
`;

export { StyledTranscriptionWrapper };
