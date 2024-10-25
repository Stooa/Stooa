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
import { media, space } from '@/ui/helpers';

const Placeholder = styled.div`
  background: ${COLOR_NEUTRO_400};
  color: ${COLOR_NEUTRO_700};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  padding: ${space()} ${space(4)} ${space(8)} ${space(4)};
  top: 0;
  width: 100%;

  & > .friend-image {
    margin-bottom: ${space(2)};
  }

  ${media.min('tablet')`
    row-gap: ${space(3)};
    justify-content: center;
  `}
`;

export default Placeholder;
