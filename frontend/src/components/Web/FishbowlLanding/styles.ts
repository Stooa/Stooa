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
import { COLOR_PURPLE_400 } from '@/ui/settings';

const Time = styled(Alert)`
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

export { Time, StyledFishbowlData, StyledDetailAlert, HelpText };
