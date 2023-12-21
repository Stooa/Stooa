/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { media, space } from '@/ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import { TITLE_SM } from '@/ui/Titles';
import { BODY_LG } from '@/ui/Texts';
import { scrolllbarStyle } from '@/ui/Scrollbar';

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
  text-align: left;

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

  & div.date {
    color: ${COLOR_NEUTRO_800};
    margin-bottom: ${space(3)};
    text-align: left;
  }

  & .description {
    color: ${COLOR_NEUTRO_700};
    overflow-y: scroll;
    max-height: 5.4em;
    word-break: break-word;

    ${scrolllbarStyle}

    ${media.min('tablet')`
        max-height: 9em;
      `}
  }

  &.prefishbowl {
    & h2 {
      ${TITLE_SM}
      ${media.min('tablet')`
        ${BODY_LG}
      `}
    }
  }
`;

const StyledFishbowlDataCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;

  color: ${COLOR_NEUTRO_600};

  margin-bottom: ${space(2)};
`;

export { StyledFishbowlDataCard, StyledFishbowlDataCardHeader };
