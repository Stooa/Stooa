/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const StyledContextButton = styled.button`
  position: absolute;
  top: ${space()};
  right: 24px;
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 5px;
  z-index: 4;
  padding: ${space()} ${space(2)};

  & svg {
    transform: rotate(90deg);
    & path {
      fill: ${COLOR_NEUTRO_100};
    }
  }
`;

const StyledContextMenu = styled.ul`
  position: absolute;
  left: 100%;
  top: 0;
  z-index: 10;
  list-style: none;
  padding: 0;

  & > li {
    background-color: ${COLOR_NEUTRO_300};
    padding: ${space(1)} ${space(2)};
  }
`;

export { StyledContextButton, StyledContextMenu };
