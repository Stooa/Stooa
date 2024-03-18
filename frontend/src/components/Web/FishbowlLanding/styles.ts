/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import Alert from '@/ui/Alert';
import { space } from '@/ui/helpers';
import { COLOR_PURPLE_400, COLOR_NEUTRO_300, COLOR_NEUTRO_400, BREAKPOINTS } from '@/ui/settings';
import { Container } from '@/ui/pages/event-detail';

const Time = styled(Alert)`
  background-color: ${COLOR_NEUTRO_300};
  border: ${COLOR_NEUTRO_400} 1px solid;
  display: inline-block;
  margin-bottom: ${space(4)};
  padding: ${space(2)} ${space(4)};
`;

const StyledFishbowlData = styled.div`
  margin-bottom: ${space(4)};
`;

const StyledDetailAlert = styled(Alert)`
  margin: 0 auto ${space(4)};
`;

const HelpText = styled.p`
  color: ${COLOR_PURPLE_400};
  margin-top: ${space(2)};
`;

const LandingContainer = styled(Container)`
  max-width: ${BREAKPOINTS.form}px;
`;

export { Time, StyledFishbowlData, StyledDetailAlert, HelpText, LandingContainer };
