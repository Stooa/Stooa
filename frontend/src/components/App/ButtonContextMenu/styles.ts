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

const StyledButton = styled.button`
  display: flex;
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 5px;
  padding: ${space(0.75)} ${space(1.75)};

  & svg {
    transform: rotate(90deg);
    & path {
      fill: ${COLOR_NEUTRO_100};
    }
  }
`;

const StyledContextMenu = styled.ul`
  position: absolute;
  left: calc(100% + ${space()});
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  top: 0;
  z-index: 6;
  list-style: none;
  padding: 0;
  border: red solid 2px;

  & > li {
    background-color: ${COLOR_NEUTRO_300};
    padding: ${space(1)} ${space(2)};
  }
`;

const StyledButtonContext = styled.div`
  z-index: 6;
`;

export { StyledButtonContext, StyledContextMenu, StyledButton };
