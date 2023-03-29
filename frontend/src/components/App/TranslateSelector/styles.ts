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

const StyledTranslate = styled.div`
  display: flex;
  align-items: center;
  gap: ${space(1)};
  margin-bottom: ${space(0.5)};

  & div.disabled {
    opacity: 0.5;
  }

  & span {
    margin-right: ${space(1)};
  }
`;

export { StyledTranslate };
