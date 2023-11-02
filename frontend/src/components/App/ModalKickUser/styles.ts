/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import Modal from '@/ui/Modal';
import { BREAKPOINTS } from '@/ui/settings';
import styled from 'styled-components';

const StyledKickModal = styled(Modal)`
  & .content {
    width: 100%;
  }

  ${media.min('tablet')`
  & .content {
    width: auto;
    max-width: ${BREAKPOINTS.desktopXL}px;
  }
`}
`;

export default StyledKickModal;
