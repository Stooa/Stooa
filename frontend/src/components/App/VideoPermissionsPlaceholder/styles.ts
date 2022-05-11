/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { COLOR_NEUTRO_400, COLOR_NEUTRO_700 } from '@/ui/settings';
import { space } from '@/ui/helpers';

const Placeholder = styled.div`
  background: ${COLOR_NEUTRO_400};
  color: ${COLOR_NEUTRO_700};
  display: grid;
  justify-items: center;
  align-items: center;
  align-content: flex-start;
  row-gap: ${space(3)};
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  padding: ${space(4)};
  top: 0;
  width: 100%;

  p {
    text-align: center;
  }
`;

export default Placeholder;
