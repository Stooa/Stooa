/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { COLOR_NEUTRO_600 } from 'ui/settings';

const Placeholder = styled.div`
  align-items: center;
  background: ${COLOR_NEUTRO_600};
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;

export default Placeholder;
