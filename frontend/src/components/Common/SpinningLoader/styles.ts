/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledSpinningLoader = styled.div`
  svg.loader {
    color: ${COLOR_NEUTRO_700};
    animation: spin 1s linear infinite;

    & circle {
      opacity: 0.25;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

export { StyledSpinningLoader };
