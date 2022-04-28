/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_500, COLOR_NEUTRO_800 } from '@/ui/settings';

const StyledFishbowlDataCard = styled.div`
  background-color: ${COLOR_NEUTRO_100};
  display: flex;
  border-radius: 4px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${space(2)};
  padding: ${space(2)} ${space(2)} ${space(2)} ${space(3)};
  position: relative;
  overflow: hidden;
  width: 100%;

  * + *:not(:last-child) {
    margin-bottom: ${space()};
  }

  &::before {
    content: '';
    background-color: ${COLOR_NEUTRO_500};
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
  }

  .card-subtitle {
    margin-bottom: ${space(3)};
  }

  h2 {
    color: ${COLOR_NEUTRO_800};
  }

  div.date {
    color: ${COLOR_NEUTRO_800};
    margin-bottom: ${space(3)};
  }
`;

export { StyledFishbowlDataCard };
