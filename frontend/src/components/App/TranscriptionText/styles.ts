/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTextContainer = styled.div`
  max-width: var(--max-width);
  position: absolute;
  z-index: 50;

  & > div {
    color: white;
    background-color: hsla(0, 0%, 0%, 0.5);
    padding: ${space()} ${space(2)};
    border-radius: ${BORDER_RADIUS};
  }
`;

const StyledTranscribedHistory = styled.div`
  position: absolute;
  bottom: 24px;
  right: 64px;
  padding: 16px 16px;
  width: 320px;
  height: 150px;
  overflow-y: auto;
  background-color: ${COLOR_NEUTRO_100};
  color: ${COLOR_NEUTRO_700};

  border: 1px solid ${COLOR_NEUTRO_600};
  border-radius: 15px;

  box-shadow: 1px 0px 20px rgba(0, 0, 0, 0.1);

  & .message:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export { StyledTextContainer, StyledTranscribedHistory };
