/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_700 } from '@/ui/settings';
import { TITLE_MD } from '@/ui/Titles';
import styled from 'styled-components';

const StyledContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  padding-top: ${space(6)};

  row-gap: ${space(8)};

  ${media.min('desktop')`
    grid-template-columns: 1fr 1fr;
    column-gap: ${space(8)};
  `}
`;

const StyledFishbowlInformation = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${space(2)} ${space(8)} 0;

  & > .counter {
    ${TITLE_MD}
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space(4)};
    text-align: center;
  }

  & > svg {
    margin-bottom: ${space(2)};
    align-self: center;
  }

  & > button {
    align-self: flex-start;
  }
`;

export { StyledContainer, StyledFishbowlInformation };
