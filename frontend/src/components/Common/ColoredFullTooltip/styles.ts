/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, rems, space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTooltip = styled.div`
  --leftPosition: 0px;

  color: ${COLOR_NEUTRO_100};
  background-color: ${COLOR_NEUTRO_700};
  height: auto;
  padding: ${space(1)} ${space(2)};
  border-radius: ${rems(4)};
  box-shadow: var(--shadow-elevation-medium);

  position: absolute;
  z-index: 10;
  text-align: center;

  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + ${space()});

  & .arrow {
    display: none;
    ${media.min('tablet')`
      display: block;
    `}
    position: absolute;
    bottom: -6px;
    left: var(--leftPosition);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #e8e8e8;
    clear: both;
    border-color: ${COLOR_NEUTRO_700} transparent transparent;
  }
`;

export { StyledTooltip };
