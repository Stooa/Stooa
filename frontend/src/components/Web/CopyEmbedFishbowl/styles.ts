/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PrimaryButton } from '@/ui/Button';
import { COLOR_NEUTRO_200 } from '@/ui/settings';
import styled from 'styled-components';

export const StyledCopyEmbedButton = styled(PrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px !important;
  height: 32px !important;

  & svg {
    margin: 0;
    margin-left: 0;
    width: 24px;
    height: 24px;

    & path {
      fill: transparent;
      stroke: ${COLOR_NEUTRO_200};
    }
  }
`;
