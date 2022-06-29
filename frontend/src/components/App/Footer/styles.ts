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
import { CustomToast } from '@/ui/CustomToast';

const Alert = styled(AlertStyled)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  padding: ${space()} ${space(2)};
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
