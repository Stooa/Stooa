/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_700
} from '@/ui/settings';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 5px;
  padding: ${space(0.75)} ${space(1.75)};
  transition: background-color 0.2s ease-in-out;

  & svg {
    transform: rotate(90deg);
    & path {
      fill: ${COLOR_NEUTRO_100};
    }
  }
`;

const StyledContextMenu = styled.ul`
  position: absolute;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  top: 0;
  z-index: 6;
  list-style: none;
  padding: 0;
  border: ${COLOR_NEUTRO_700} solid 1px;
  color: ${COLOR_NEUTRO_700};
  border-radius: ${BORDER_RADIUS};
  overflow: hidden;
  width: max-content;

  & > li {
    background-color: ${COLOR_NEUTRO_300};
    padding: ${space(1)} ${space(2)};
    transition: background-color 0.15s ease-in;

    &:hover {
      background-color: ${COLOR_NEUTRO_400};
      transition: background-color 0.2s ease-out;
    }
  }
`;

const StyledButtonContext = styled.div`
  position: relative;

  & > #context-menu {
    top: calc(100% + ${space(0.5)});
    right: 0;
  }
`;

export { StyledButtonContext, StyledContextMenu, StyledButton };
