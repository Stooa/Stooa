/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { BREAKPOINTS } from '@/ui/settings';
import { space, rems } from '@/ui/helpers';

const Container = styled.div<{ centered?: boolean }>`
  margin: ${space(4)} 0 ${space(2)};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  max-width: ${BREAKPOINTS.desktop}px;
  width: 100%;
`;

const Description = styled.p`
  max-width: ${rems(620)};
  margin: ${space(3)} auto 0;
  text-align: center;
`;

export { Container, Description };
