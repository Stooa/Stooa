/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, rems, space } from '@/ui/helpers';
import styled from 'styled-components';

export const StyledDescription = styled.div<{ center?: boolean }>`
  margin-bottom: ${space(5)};
  text-align: left;

  a {
    text-decoration: underline;
  }

  ${media.min('tablet')`
  margin: ${({ center }) => (center ? `0 auto ${space(5)}}` : `0 0 ${space(5)}}`)};
  max-width: ${rems(700)};
  text-align:'left';

  ${media.min('tablet')`
    text-align: ${({ center }) => (center ? 'center' : 'left')};
    margin: ${({ center }) => (center ? `0 auto ${space(5)}}` : `0 0 ${space(5)}}`)};
  `}
  `}

  p + p {
    margin-top: ${space(2)};
  }
`;
