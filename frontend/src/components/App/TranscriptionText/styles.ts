/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { scrolllbarStyle } from '@/ui/Scrollbar';
import { BORDER_RADIUS, COLOR_NEUTRO_200, COLOR_NEUTRO_300, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTextContainer = styled.div`
  max-width: var(--max-width);
  position: absolute;
  z-index: 40;
  color: white;
  background-color: hsla(0, 0%, 0%, 0.5);
  padding: ${space(0.5)} ${space(0.5)};
  border-radius: ${BORDER_RADIUS};
  font-size: 0.75rem;

  max-height: 44px;
  overflow-y: auto;

  backdrop-filter: blur(6px);

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }

  ${media.min('tablet')`
    font-size: 1rem;
    padding: ${space()} ${space(2)};

    max-height: 58px;
  `}
`;

const StyledTranscribedHistory = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: ${COLOR_NEUTRO_700};
  background-color: ${COLOR_NEUTRO_200};
  border: 1px solid ${COLOR_NEUTRO_300};
  border-radius: ${BORDER_RADIUS};
  padding-inline: 0.5rem;
  margin-block-start: ${space(1)};

  ${scrolllbarStyle};

  & .message:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export { StyledTextContainer, StyledTranscribedHistory };
