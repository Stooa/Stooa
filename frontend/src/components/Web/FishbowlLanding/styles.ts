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
import { COLOR_PURPLE_400, COLOR_NEUTRO_300, COLOR_NEUTRO_400 } from '@/ui/settings';

const Time = styled(Alert)`
  width: 100%;
  background-color: ${COLOR_NEUTRO_300};
  border: ${COLOR_NEUTRO_400} 1px solid;
  padding: ${space(2)} ${space(4)};
`;

const HelpText = styled.p`
  color: ${COLOR_PURPLE_400};
  margin-top: ${space(2)};
`;

export { Time, HelpText };
