/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { media, space } from '@/ui/helpers';

const Wrapper = styled.div<{ small?: boolean; reader?: boolean }>`
  background-color: red !important;
  margin: 0 auto;
  max-width: ${({ reader }) => (reader ? '70ch' : '95vw')};
  width: 100%;

  ${media.max('reader')`
    ${({ reader }) => reader && `padding: 0 ${space(2)}`};
  `}

  ${media.min('large')`
    ${({ small }) => small && `max-width: 60vw;`}
  `}
`;

export default Wrapper;
