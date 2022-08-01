/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space } from '@/ui/helpers';
import { BREAKPOINTS } from './settings';

const Wrapper = styled.div<{ small?: boolean; reader?: boolean }>`
  margin: 0 auto;
  max-width: ${({ reader }) => (reader ? '70ch' : '95vw')};
  width: 100%;

  @media (max-width: ${BREAKPOINTS.reader}px) {
    ${({ reader }) => reader && `padding: 0 ${space(2)}`};
  }

  @media (min-width: ${BREAKPOINTS.desktopLarge}px) {
    ${({ small }) => small && `max-width: 60vw;`}
  }
`;

export default Wrapper;
