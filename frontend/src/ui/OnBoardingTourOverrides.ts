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
  COLOR_PURPLE_200,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  FONT_PRIMARY
} from './settings';
import { BODY_LG, mediumWeight, TYPOGRAPHY_SIZES } from './Texts';

const OnBoardingTourOverrides = css`
  div.introjs-helperLayer {
    box-shadow: rgb(33 33 33 / 50%) 0px 0px 0px 5000px !important;
  }

  .introjs-tooltipReferenceLayer * {
    font-family: ${FONT_PRIMARY} !important;
  }

  .custom-onboarding-tooltip {
    box-sizing: border-box !important;
    background-color: ${COLOR_NEUTRO_200} !important;
    padding: ${space(2)} ${space(2)} ${space(3)};
    width: 80vw !important;

    ${media.min('desktop')`
      width: auto !important;
      min-width: 360px !important;
    `}

    & > .introjs-tooltip-header {
      padding: unset;
      & > .introjs-skipbutton {
        color: ${COLOR_NEUTRO_600};
      }
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

        ${media.min('tablet')`
          width: auto;
        `}
      }

      &.first-step > .image {
        width: 50%;
      }

      & > h3 {
        ${BODY_LG}
        ${mediumWeight}
        color: ${COLOR_NEUTRO_700};
        margin-bottom: ${space()};
      }
    }

    & .introjs-bullets {
      padding-top: 0;
      padding-bottom: 0;
      margin-bottom: ${space(2)};

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
      padding: 0;
      border-top: none;

      & a.introjs-nextbutton:not(.introjs-hidden) {
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

        background-color: ${COLOR_PURPLE_200};
        color: ${COLOR_PURPLE_500};

        &:hover {
          color: ${COLOR_NEUTRO_100};
          background-color: ${COLOR_PURPLE_400};
        }

        &:focus {
          box-shadow: none;
        }
      }

      & a.introjs-prevbutton:not(.introjs-hidden) {
        color: ${COLOR_PURPLE_500};
        font-size: var(--fontSize);
        line-height: var(--lineHeight);
        border: none;
        background-color: unset;
        text-decoration: underline;

        &:hover {
          color: ${COLOR_PURPLE_400};
        }

        &:focus {
          box-shadow: none;
        }
      }
    }

    &.first-step .introjs-tooltipbuttons a.introjs-nextbutton:not(.introjs-hidden) {
      background-color: ${COLOR_PURPLE_500};
      color: ${COLOR_NEUTRO_100};

      &:hover {
        color: ${COLOR_NEUTRO_100};
        background-color: ${COLOR_PURPLE_400};
      }

      &:focus {
        box-shadow: none;
      }

      &:disabled {
        cursor: not-allowed;
        background-color: ${COLOR_NEUTRO_300};
        color: ${COLOR_NEUTRO_500};
        pointer-events: none;
      }
    }

    ${media.max('desktop')`
      &.second-step {
        left: auto !important;
        right: 0;
        margin-left: 0 !important;
        margin-top: 0 !important;
        width: 275px !important;

        & > .introjs-arrow {
          top: -10px;
          bottom: auto !important;
          border-bottom: 5px solid ${COLOR_NEUTRO_200};
          border-top-color: transparent !important;
          left: auto;
          right: 90px;
          display: inherit !important;
        }
      }

      &.third-step {
        left: auto !important;
        right: 0;

        & > .introjs-arrow {
          left: auto !important;
          right: 26px;
        }
      }
    `}

    @media (max-height: 720px) {
      &.second-step {
        right: 0;
        top: 91px !important;
      }
    }
  }
`;
export { OnBoardingTourOverrides };
