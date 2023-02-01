/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_400, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledRecordingStatus = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: ${space()};
  left: 50%;
  transform: translateX(-50%);
  color: ${COLOR_NEUTRO_700};
  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
  line-height: 1.33;
  padding: ${space(1)} ${space(1.5)} ${space(0.75)} ${space(1)};

  &.moderator {
    padding: ${space(1)} ${space(1)} ${space(0.75)} ${space(1.5)};

    & > svg {
      margin-left: ${space(0.5)};
    }
  }

  & > svg:not(.stop) {
    margin-right: ${space(0.5)};
  }

  ${media.min('tablet')`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
`;

export { StyledRecordingStatus };
