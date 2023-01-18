/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space, rems, media } from '@/ui/helpers';

import {
  BREAKPOINTS,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700
} from '@/ui/settings';

const spacingSizes = {
  mobile: {
    small: 2,
    medium: 4,
    large: 6
  },
  desktop: {
    small: 4,
    medium: 8,
    large: 12
  }
};

const Billboard = styled.div`
  display: grid;
  position: relative;
  width: 100%;

  text-align: left;
  margin-bottom: ${space(14)};
  margin-inline: auto;
  padding-top: ${space(5)};
  z-index: 3;

  h1 {
    margin-bottom: ${space(2)};
  }

  .billboard-text {
    width: 100%;
    padding: 0 ${space(8)};
  }

  .fishbowl-preview {
    position: relative;
    width: 100%;
    justify-self: center;
    padding: 0 ${space(4)};

    align-self: center;
    filter: drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.1));

    & img {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      object-fit: contain;
      object-position: center;
      margin: 0 auto;
    }
  }

  ${media.min('tablet')`
    align-items: center;
    min-height: 50vh;
    margin-bottom: ${space(20)};

    .billboard-text {
      padding: 0 ${space(10)};
      }
  `}

  ${media.min('desktop')`
  grid-template-columns: 4fr 5fr;

    .title-display {
      font-size: ${rems(61)};
    }

    .billboard-text {
      min-width: 700px;
      padding: 0 ${space(8)} 0 ${space(16)};
    }

    .fishbowl-preview {
      height: 38vw;

      & img {
        position: absolute;
        object-fit: cover;
        object-position: left;
      }
    }

  `}

  ${media.min('desktopLarge')`
    min-height: 55vh;
  `}

  .cta-wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: ${space(4)};

    & a:first-child {
      margin-bottom: ${space(2)};
    }

    ${media.min('phone')`
      align-items: center;
    `}

    ${media.min('tablet')`
      flex-direction: row;

      & a:first-child {
        margin-right: ${space(3)};
        margin-bottom: 0;
      }
    `}
  }

  #scroll-indicator {
    position: absolute;
    bottom: -5rem;
    left: calc(50% - 20px);
    height: 40px;
    width: 40px;

    ${media.min('tablet')`
      bottom: -5rem;
    `}
  }

  #animated-billboard-morph,
  #animated-billboard-morph2 {
    position: absolute;
    width: ${rems(80)};
    height: ${rems(160)};
    z-index: -1;

    ${media.min('tablet')`
      height: ${rems(280)};
      width: ${rems(140)};
    `}

    ${media.min('desktop')`
      height: ${rems(400)};
      width: ${rems(200)};
    `}
  }

  #animated-billboard-morph {
    display: none;

    ${media.min('tablet')`
      display: block;
      left: -70px;
      top: 0;
    `}

    ${media.min('desktop')`
      top: 50%;
      transform: translateY(-50%);
    `}
  }

  #animated-billboard-morph2 {
    right: 0;
    bottom: -20%;

    ${media.min('tablet')`
      bottom: -30%;
    `}

    ${media.min('desktop')`
      bottom: -30%;
    `}
  }
`;

const Content = styled.div`
  min-height: ${rems(250)};
  position: relative;
  width: 100%;
  z-index: 2;

  .last-row {
    border-image-source: url('/img/web/svg/wave-desktop-bottom.svg');
    border-bottom: solid 100px;
    background-clip: padding-box;
    border-image-slice: 0 0 100;
  }

  .row-list {
    position: relative;
    z-index: 1;

    #animated-billboard-desktop,
    #animated-billboard-mobile {
      height: ${rems(280)};
      margin: 0 auto;
      max-width: ${rems(960)};
      padding: 0 ${space(3)};
      position: relative;

      ${media.min('tablet')`
        height: ${rems(220)};
        top: ${space(3)};
      `}

      ${media.min('desktopLarge')`
        top: ${space(2)};
      `}

      ${media.min('desktopXL')`
        top: ${space(-3)};
      `}
    }

    .hide-mobile {
      ${media.max('tablet')`
        display: none;
      `}
    }

    .hide-desktop {
      ${media.min('tablet')`
        display: none;
      `}
    }
  }

  .wave {
    top: -80px;
    display: block;
    position: absolute;
    right: -2px;
    width: 100%;
    z-index: -1;

    &.hide-mobile {
      width: 105%;
    }

    &.hide-desktop {
      top: -60px;
    }

    ${media.min('desktop')`
      top: -110px;
    `}
  }

  .youtube-wrapper {
    position: relative;
    width: 100%;
  }

  #animated-youtube-morph {
    position: absolute;
    width: ${rems(100)};
    height: ${rems(70)};
    /* z-index: -1; */
  }

  .how-subtitle {
    margin-bottom: ${space(6)};
  }

  ${media.max('tablet')`
    .title-lg {
      font-size: ${rems(39)};
    }
  `}
`;

const Sections = styled.div`
  padding: ${space(8)} 0;

  ${media.min('tablet')`
    padding: ${space(15)} 0 ${space(5)};
  `}
`;

const Wrapper = styled.div<{ colored?: boolean; spacing?: 'small' | 'medium' | 'large' }>`
  margin: 0 auto;
  padding: ${({ spacing }) =>
    spacing ? `${space(spacingSizes.mobile[spacing])} ${space(3)}` : `0 ${space(3)}`};
  position: relative;

  background-color: ${({ colored }) => (colored ? COLOR_NEUTRO_300 : 'transparent')};

  ${media.min('tablet')`
    padding: ${({ spacing }) =>
      spacing ? `${space(spacingSizes.desktop[spacing])} ${space(3)}` : `0 ${space(6)}`};
  `}

  #animated-keybenefit2-morph {
    height: ${rems(160)};
    position: absolute;
    right: 0;
    top: -50%;
    width: ${rems(80)};
    z-index: -1;

    ${media.min('tablet')`
      height: ${rems(360)};
      width: ${rems(180)};
    `}
  }
`;

const StyledResponsiveRow = styled.div<{
  reverse?: boolean;
  align?: 'flex-end' | 'center' | 'flex-start';
}>`
  display: grid;
  align-items: center;
  gap: ${space(4)} ${space(7)};

  max-width: ${BREAKPOINTS.desktopLarge}px;
  margin: 0 auto;

  padding-block: ${space(4)};

  text-align: left;

  ${media.min('desktopLarge')`
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  `}

  & > .item {
    position: relative;

    &.centered {
      display: flex;
      justify-content: center;
      min-height: ${rems(240)};
    }

    & img {
      object-fit: contain;
    }

    & iframe {
      ${media.min('desktopLarge')`
        max-width: 700px;
      `}
    }
  }

  .first-item {
    order: ${({ reverse }) => (reverse ? '-1' : '')};
  }
`;

const Row = styled.div<{ reverse?: boolean; flex?: boolean; colored?: boolean }>`
  background-color: ${({ colored }) => (colored ? `${COLOR_NEUTRO_300}` : 'transparent')};
  padding: ${({ colored }) =>
    colored ? `${space(9)} ${space(3)} ${space(10)}` : `0 0 ${space(8)} 0`};
  position: relative;
  text-align: left;
  width: 100%;

  .title-lg,
  strong {
    font-weight: 500;
  }

  .title-lg {
    color: ${({ colored }) => (colored ? `${COLOR_NEUTRO_700}` : `${COLOR_NEUTRO_600}`)};
    margin-bottom: ${space(2)};
  }

  .title-lg.definition {
    ${media.min('tablet')`
      text-align: center;
    `}
  }

  ${media.min('tablet')`
    padding: ${({ colored }) => (colored ? `${space(10)} 0 ${space(15)}` : `0 0 ${space(15)} 0`)};
    text-align: ${({ flex }) => (flex ? 'left' : 'center')};

    .title-lg {
      font-weight: 600;
    }
  `}

  ${media.min('desktop')`
    align-items: center;
    display: ${({ flex }) => (flex ? 'flex' : 'auto')};
    flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
    justify-content: center;

    .col:nth-child(n) {
      margin-right: ${({ reverse }) => (reverse ? 0 : `${space(15)}`)};
    }

    .col:nth-child(2n) {
      margin-right: ${({ reverse }) => (reverse ? `${space(15)}` : 0)};
    }
  `}
`;

const Column = styled.div`
  position: relative;

  ${media.max('desktop')`
    margin-bottom: ${space(5)};

    &.col:nth-child(2n) {
      align-items: center;
      display: flex;
      flex-direction: column;
    }

    &.col:nth-child(n) {
      display: block;
    }
  `}

  #animated-keybenefit1,
  #animated-keybenefit2 {
    max-width: ${rems(600)};
  }

  #animated-keybenefit3,
  #animated-keybenefit4 {
    max-width: ${rems(500)};
  }

  .title-lg,
  p {
    max-width: ${rems(700)};

    ${media.min('desktop')`
      max-width: ${rems(440)};
  `}
  }

  img {
    margin: 0 auto;
  }
`;

const Banner = styled.div`
  background-color: ${COLOR_NEUTRO_200};
  padding: ${space(10)} ${space(2)};
  position: relative;
  text-align: center;

  .body-lg {
    margin-bottom: ${space(5)};
  }

  #animated-banner-morph {
    height: ${rems(160)};
    position: absolute;
    left: 0;
    top: ${rems(-80)};
    width: ${rems(80)};

    ${media.min('tablet')`
      height: ${rems(300)};
      top: ${rems(-150)};
      width: ${rems(150)};
    `}
  }

  ${media.min('tablet')`
    padding: ${space(15)} ${space(2)};

    .body-lg {
      margin: 0 auto ${space(5)};
      max-width: ${rems(550)};
    }
  `}
`;

export { Content, Row, StyledResponsiveRow, Column, Billboard, Wrapper, Banner, Sections };
