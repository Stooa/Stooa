/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import AlertStyled from '@/ui/Alert';
import { media, rems, space } from '@/ui/helpers';

const Alert = styled(AlertStyled)`
  bottom: 100%;
  left: 50%;
  padding: ${space()} ${space(2)};
  position: absolute;
  transform: translateX(-50%);
  z-index: 9;

  ${media.min('tablet')`
    .drawer-open & {
      transform: translateX(-50%) translateX(${rems(-320)});
    }
  `}

  ${media.min('tabletLarge')`
    .drawer-open & {
      transform: translateX(-50%) translateX(${rems(-350)});
    }
  `}
`;

export { Alert };
