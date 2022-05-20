/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media } from '@/ui/helpers';
import styled from 'styled-components';

export const StyledSvg = styled.svg`
  transform: scale(0.75);

  ${media.min('tablet')`
      transform: scale(1);
    `}
`;
