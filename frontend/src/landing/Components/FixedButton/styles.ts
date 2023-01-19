/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const StyledButtonWrapper = styled.div`
  display: block;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: ${space(3)} ${space(1.5)};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${COLOR_NEUTRO_300} 100%);

  ${media.min('tablet')`
    display: none;
  `}
`;

export { StyledButtonWrapper };
