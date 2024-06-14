/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_PURPLE_500 } from '@/ui/settings';
import styled from 'styled-components';

const MainGrid = styled.div`
  display: grid;
  min-height: 300px;
  grid-template-columns: 1fr;
  column-gap: ${space(20)};
  row-gap: ${space(6)};
  justify-content: space-between;

  ${media.min('tablet')`
    grid-template-columns: 1fr 1fr;
  `}

  & + *:not(:last-child) {
    margin-bottom: ${space(1)};
  }

  .left-column {
    width: 100%;

    ${media.min('tablet')`
    max-width: 400px;
    `}

    p.description,
      button {
      margin-bottom: ${space(3)};
    }

    div.enter-fishbowl {
      margin-bottom: ${space(3)};
    }

    .share-text {
      ${media.max('tablet')`
          text-align: center;
      `}
    }

    ul.social-links {
      padding-left: 0;
      list-style: none;
      display: flex;
      justify-content: center;

      ${media.min('tablet')`
        justify-content: flex-start;
      `}

      li {
        margin-top: ${space()};
      }

      li + li {
        ${media.max('tablet')`
          margin-left: ${space(4)};
        `}

        margin-left: ${space(1)};
      }

      .icon-wrapper {
        ${media.max('tablet')`
        transform: scale(1.5);
        `}

        background-color: ${COLOR_PURPLE_500};
        border-radius: 50%;
        display: inline-block;
        height: ${space(4)};
        width: ${space(4)};
        padding: ${space(1)};

        svg path {
          fill: ${COLOR_NEUTRO_100};
        }
      }
    }
  }
`;

export { MainGrid };
