/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CustomToast } from '@/ui/CustomToast';
import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledIntroNotification = styled(CustomToast)`
  padding-right: ${space(4.5)};
  & > .cross {
    width: 16px;
    height: 16px;
    position: absolute;
    right: ${space(1.25)};
    top: 50%;
    transform: translateY(-50%);

    & svg path {
      fill: currentColor;
    }
  }
`;

export { StyledIntroNotification };
