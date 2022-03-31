/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { rems, media } from '@/ui/helpers';
import Modal from '@/ui/Modal';

const OnboardingModal = styled(Modal)`
  &.hide {
    display: none;
  }

  .content {
    height: 85vh;
    min-height: ${rems(420)};
    max-height: ${rems(680)};
    max-width: ${rems(840)};
    padding: 0;
    width: 100%;

    ${media.min('maxWidth')`
      max-width: ${rems(920)};
    `}

    ${media.min('tablet')`
    height: ${rems(520)};
    `}
  }
`;

export default OnboardingModal;
