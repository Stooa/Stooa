/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const StyledContextButton = styled.button`
  position: relative;
  background-color: hsla(0, 0, 0, 0.75);

  & svg {
    transform: rotate(45deg);
    & path {
      fill: ${COLOR_NEUTRO_100};
    }
  }
`;

export { StyledContextButton };
