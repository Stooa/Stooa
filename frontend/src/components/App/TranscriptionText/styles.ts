/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { BORDER_RADIUS } from '@/ui/settings';
import styled from 'styled-components';

const StyledTextContainer = styled.div`
  width: minmax(200px, 50%);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: ${space(12)};
  z-index: 50;
  & > div {
    color: white;
    background-color: hsla(0, 0%, 0%, 0.5);
    padding: ${space()} ${space(2)};
    border-radius: ${BORDER_RADIUS};
  }
`;

export { StyledTextContainer };
