/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { scrolllbarStyle } from '@/ui/Scrollbar';
import { BORDER_RADIUS, COLOR_NEUTRO_500, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTextContainer = styled.div`
  max-width: var(--max-width);
  position: absolute;
  z-index: 40;

  & > div {
    color: white;
    background-color: hsla(0, 0%, 0%, 0.5);
    padding: ${space()} ${space(2)};
    border-radius: ${BORDER_RADIUS};
  }
`;

const StyledTranscribedHistory = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: ${COLOR_NEUTRO_700};
  border: 1px solid ${COLOR_NEUTRO_500};
  border-radius: ${BORDER_RADIUS};
  padding-inline: 0.5rem;

  ${scrolllbarStyle};

  & .message:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export { StyledTextContainer, StyledTranscribedHistory };
