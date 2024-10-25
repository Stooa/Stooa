/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BORDER_RADIUS, COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const StyledIframe = styled.iframe`
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;

  &.youtube-stooa {
    border: 8px solid ${COLOR_NEUTRO_300};
    border-radius: ${BORDER_RADIUS};
    box-shadow: 0px 5px 15px 0px rgba(144, 118, 111, 0.5);
  }
`;

export { StyledIframe };
