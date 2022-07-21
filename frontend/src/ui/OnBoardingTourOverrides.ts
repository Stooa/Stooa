/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';
import { media, space } from './helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600,
  COLOR_RED_500
} from './settings';
import { BODY_LG, mediumWeight, TYPOGRAPHY_SIZES } from './Texts';

const OnBoardingTourOverrides = css`
  .custom-onboarding-tooltip {
    background-color: ${COLOR_NEUTRO_200};
    min-width: 360px;
    padding: ${space()};

    & > .introjs-tooltip-header {
      padding: unset;
    }

    & > .introjs-tooltiptext {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: unset;
      margin-bottom: ${space(2)};

      color: ${COLOR_NEUTRO_800};
      text-align: center;

      & > .image {
        margin-bottom: ${space(2)};

        width: 50%;
      }

      & > h3 {
        ${BODY_LG}
        ${mediumWeight}
        color: ${COLOR_NEUTRO_700};
      }
    }

    & .introjs-bullets {
      padding-top: 0;

      & ul > li {
        margin: 0 ${space(0.7)};
      }

      & ul a,
      & ul a.active {
        width: 10px;
        height: 10px;
        background-color: ${COLOR_NEUTRO_400};
      }

      & ul a:hover {
        width: 10px;
        background-color: ${COLOR_NEUTRO_500};
      }

      & ul a.active {
        background-color: ${COLOR_NEUTRO_600};
      }
    }

    & .introjs-tooltipbuttons {
      border-top: none;
      & a:not(.introjs-hidden) {
        box-sizing: border-box;
        --padding: ${space(1)} ${space(3)} ${space(0.875)} ${space(3)};
        --fontSize: ${TYPOGRAPHY_SIZES.body_sm.fontSize};
        --lineHeight: ${TYPOGRAPHY_SIZES.body_sm.lineHeight};

        ${mediumWeight};
        width: auto;
        align-items: center;
        border: none;
        border-radius: ${space(3)};
        cursor: pointer;
        display: inline-flex;
        font-size: var(--fontSize);
        justify-content: center;
        line-height: var(--lineHeight);
        padding: var(--padding);
        position: relative;
        text-decoration: none;
        transition: 0.1s ease-out;
        will-change: background, color;
        text-shadow: none;

        background-color: ${COLOR_PURPLE_500};
        color: ${COLOR_NEUTRO_100};

        &:hover {
          color: ${COLOR_NEUTRO_100};
          background-color: ${COLOR_PURPLE_400};
        }

        &:focus {
          color: ${COLOR_NEUTRO_100};
          background-color: ${COLOR_PURPLE_600};
        }

        &:disabled {
          cursor: not-allowed;
          background-color: ${COLOR_NEUTRO_300};
          color: ${COLOR_NEUTRO_500};
          pointer-events: none;
        }
      }
    }

    ${media.min('tablet')`
      min-width: 360px;
    `}
  }
`;
export { OnBoardingTourOverrides };
