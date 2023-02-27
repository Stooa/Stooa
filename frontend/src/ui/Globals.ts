/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createGlobalStyle, css } from 'styled-components';

import { Button } from '@/ui/Resets';
import Texts, { TYPOGRAPHY_SIZES } from '@/ui/Texts';
import Titles from '@/ui/Titles';
import Overrides from '@/ui/Overrides';
import { OnBoardingTourOverrides } from '@/ui/OnBoardingTourOverrides';

import { media, space } from '@/ui/helpers';
import {
  COLOR_GREEN_100,
  COLOR_GREEN_500,
  COLOR_GREEN_800,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600,
  COLOR_RED_100,
  COLOR_RED_600,
  COLOR_YELLOW_100,
  COLOR_YELLOW_500,
  FONT_BASE_SIZE,
  FONT_PRIMARY
} from '@/ui/settings';
import { getIconCSS } from '@/ui/Icons';

const StyledLinkCss = css`
  color: ${COLOR_NEUTRO_700};
  font-size: var(--fontSize);
  line-height: var(--lineHeight);
  cursor: pointer;

  &.colored {
    color: ${COLOR_PURPLE_500};

    &:hover {
      color: ${COLOR_PURPLE_400};
    }

    &:focus {
      color: ${COLOR_PURPLE_600};
    }
  }

  &:hover {
    color: ${COLOR_NEUTRO_600};
  }

  &:focus {
    color: ${COLOR_NEUTRO_800};
  }
`;

const GlobalStyle = createGlobalStyle`
  /* @font-face {
    font-display: swap;
    font-family: 'Geomanist';
    font-style: normal;
    font-weight: 400;
    src: local('Geomanist Regular'), url("/fonts/geomanist-regular.woff2") format("woff2"),url("fonts/geomanist-regular.woff") format("woff");
  }

  @font-face {
    font-display: swap;
    font-family: 'Geomanist';
    font-style: normal;
    font-weight: 500;
    src: local('Geomanist Medium'), url("/fonts/geomanist-medium.woff2") format("woff2"),url("fonts/geomanist-medium.woff") format("woff");
  }

  @font-face {
    font-display: swap;
    font-family: 'Geomanist';
    font-style: normal;
    font-weight: 700;
    src: local('Geomanist Bold'), url("/fonts/geomanist-bold.woff2") format("woff2"),url("fonts/geomanist-bold.woff") format("woff");
  }

    @font-face {
      font-display: swap;
      font-family: 'Geomanist';
      font-style: italic;
      font-weight: 400;
      src: local('Geomanist Italic Medium'), url("/fonts/geomanist-regular-italic.woff2") format("woff2"),url("fonts/geomanist-regular-italic.woff") format("woff");
    }

  @font-face {
    font-display: swap;
    font-family: 'Geomanist';
    font-style: italic;
    font-weight: 500;
    src: local('Geomanist Italic Regular'), url("/fonts/geomanist-medium-italic.woff2") format("woff2"),url("fonts/geomanist-medium-italic.woff") format("woff");
  } */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul,
  ol,
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  html {
    font-size: ${FONT_BASE_SIZE}px;
  }

  body {
    /* font-family: ${FONT_PRIMARY}; */
    line-height: 1.5;
    min-height: 100vh;
    overflow-x: hidden;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
  }

  ul:not([class]),
  ol:not([class]) {
    list-style: none;
    padding: 0;
  }

  a {
    ${StyledLinkCss}
    --fontSize: ${TYPOGRAPHY_SIZES.body_sm.fontSize};
    --lineHeight: ${TYPOGRAPHY_SIZES.body_sm.lineHeight};
    text-decoration: none;
    text-decoration-skip-ink: auto;

    &.decorated {
      text-decoration: underline;
    }

    * {
      pointer-events: none;
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  article > * + * {
    margin-top: 1em;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  dt, dd {
    margin: 0 0 ${space()};
  }

  dt {
    font-weight: 700;
  }

  ${media.min('phone')`
    dl {
      display: grid;
      grid-template-columns: max-content auto;
    }

    dt {
      grid-column-start: 1;
    }

    dd {
      grid-column-start: 2;
      padding: 0 0 0 ${space(2)};
    }
  `}

  ${Button};
  ${Titles};
  ${Texts};
  ${Overrides};

  .prewrap { white-space: pre-wrap; }
  .centered { text-align: center; }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  .hidden {
    display: none;
  }

  .hide-mobile {
    ${media.max('tablet')`
      display: none !important;
    `}
  }

  .hide-desktop {
    ${media.min('tablet')`
      display: none !important;
    `}
  }

  .icon {
    ${getIconCSS()};
    color: ${COLOR_NEUTRO_700};
    height: ${space(4)};
    margin: 0 ${space(0.25)};
    width: ${space(4)};
  }

  .icon-small {
    height: ${space(2)};
    width: ${space(2)};
  }

  /* CUSTOM SHADOWS */
  :root {
    --shadow-color: 0deg 0% 79%;
    --shadow-elevation-medium: -0.1px 0.2px 0.3px hsl(var(--shadow-color) / 0.36),
      -0.3px 0.6px 0.8px -0.8px hsl(var(--shadow-color) / 0.36),
      -0.8px 1.4px 1.8px -1.7px hsl(var(--shadow-color) / 0.36),
      -2px 3.5px 4.5px -2.5px hsl(var(--shadow-color) / 0.36);
  }

  /*  CUSTOM TOASTS STYLES */
  :root {
    --toastify-toast-width: fit-content !important;

    --toastify-text-color-light: ${COLOR_NEUTRO_700} !important;
    --toastify-color-success: ${COLOR_GREEN_500} !important;
    --toastify-text-color-success: ${COLOR_GREEN_800} !important;
    --toastify-color-warning: ${COLOR_YELLOW_500} !important;
    --toastify-color-error: ${COLOR_RED_600} !important;
  }

  .toastify-custom {


      &.Toastify__toast-container {
        --toastify-z-index: 30;
        ${media.max('tablet')`
          width: 92%;
          left: 50%;
          transform: translateX(-50%);
          .Toastify__toast {border-radius: 4px;}
        `}
      }

      & .Toastify__toast {
        padding: ${space(0)} ${space(2)};

        .Toastify__toast-icon {
          display: inline-flex !important;
          min-width: 24px !important;
          width: auto !important;
        }
      }

      & .Toastify__toast-theme--light.Toastify__toast--info {
        --toastify-color-light: ${COLOR_NEUTRO_100};
        --toastify-text-color-light: ${COLOR_NEUTRO_700};
        --toastify-color-progress-info: ${COLOR_NEUTRO_600};

        & .Toastify__close-button.Toastify__close-button--light {
          color: ${COLOR_NEUTRO_700};
          opacity: 1;
          }
      }

      & .Toastify__toast-theme--light.Toastify__toast--warning {
        --toastify-color-light: ${COLOR_YELLOW_100};


        & .Toastify__close-button.Toastify__close-button--light {
          color: ${COLOR_NEUTRO_600};
          opacity: 1;
          }
      }

      & .Toastify__toast-theme--light.Toastify__toast--error {
        --toastify-color-light: ${COLOR_RED_100};

        & .Toastify__close-button.Toastify__close-button--light {
          color: ${COLOR_NEUTRO_600};
          opacity: 1;
          }
      }

      & .Toastify__toast-theme--light.Toastify__toast--success {
        --toastify-color-light: ${COLOR_GREEN_100};
        --toastify-text-color-light: ${COLOR_GREEN_800};

        & .Toastify__close-button.Toastify__close-button--light {
          color: ${COLOR_GREEN_800};
          opacity: 1;
          }
      }

      &.Toastify__toast-container--bottom-center {
        bottom: ${space(12)};

        ${media.min('desktop')`
          bottom: ${space(10)};
        `}
      }

      & .Toastify__toast-body {
        padding: ${space(2)} ${space(2)} ${space(2)} 0;
      }

      & .Toastify__close-button {
        align-self: center;
      }
    }

    ${OnBoardingTourOverrides}


`;

export { StyledLinkCss };
export default GlobalStyle;
