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
import { BODY_LG, mediumWeight } from '@/ui/Texts';
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

    & + :not(.description) {
      margin-top: ${space(3)};
    }
  }

  .question {
    color: ${COLOR_NEUTRO_700};

    &:not(:last-child) {
      margin-bottom: ${space(3)};
    }

    & .question-title {
      display: flex;
      gap: ${space(2)};
      & h3 {
        ${mediumWeight};
        max-width: 45ch;
      }

      & + * {
        margin-top: ${space()};
      }
    }
  }

  & div.date {
    color: ${COLOR_NEUTRO_800};
    margin-bottom: ${space(3)};
  }

  & .description {
    color: ${COLOR_NEUTRO_700};
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 0;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    margin-bottom: ${space()};

    &.closed {
      max-height: 4.9em;
      -webkit-line-clamp: 3;
    }

    & + *:not(.see-more) {
      margin-top: ${space(3)};
    }

    ${scrolllbarStyle}
  }

  & .see-more {
    margin-bottom: ${space(3)};
  }

  &.prefishbowl {
    & h2 {
      ${TITLE_SM};
      ${media.min('tablet')`
        ${BODY_LG}
      `}
    }
  }
`;

const StyledFishbowlDataCardScroll = styled.div`
  ${scrolllbarStyle};
  overflow-y: scroll;
  max-height: 500px;
`;

const StyledFishbowlDataCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;

  color: ${COLOR_NEUTRO_600};

  margin-bottom: ${space(2)};
`;

export { StyledFishbowlDataCard, StyledFishbowlDataCardHeader, StyledFishbowlDataCardScroll };
