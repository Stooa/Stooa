/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;

  column-gap: ${space(8)};
`;

const StyledFishbowlInformation = styled.div`
  display: flex;
  flex-direction: column;
`;

export { StyledContainer, StyledFishbowlInformation };
