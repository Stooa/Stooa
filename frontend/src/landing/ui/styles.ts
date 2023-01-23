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
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700
} from '@/ui/settings';

const Billboard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${space(14)};
  padding: 0 ${space(3)};
  padding-top: ${space(5)};
  position: relative;
  text-align: left;
  z-index: 3;
  width: 100%;

  .title-display {
    margin-bottom: ${space(2)};
  }

  ${media.max('desktop')`
    .title-display {
      font-size: ${rems(61)};
    }
  `}

  ${media.min('tablet')`
    align-items: center;
    min-height: 50vh;
    margin-bottom: 0;
    padding-top: 0;
    text-align: center;
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

  #animated-billboard-morph,
  #animated-billboard-morph2 {
    height: ${rems(160)};
    position: absolute;
    z-index: -1;
    width: ${rems(80)};

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
      left: 0;
      top: 0;
    `}

    ${media.min('desktop')`
      top: 50%;
      transform: translateY(-50%);
    `}
  }

  #animated-billboard-morph2 {
    right: 0;
    top: 30%;

    ${media.min('tablet')`
      top: 60%;
    `}

    ${media.min('desktop')`
      top: 30%;
    `}
  }
`;

const Content = styled.div`
  min-height: ${rems(250)};
  position: relative;
  width: 100%;
  z-index: 2;

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

    .wave {
      bottom: -5px;
      display: block;
      position: absolute;
      right: -2px;
      width: 100%;
      z-index: -1;

      &.hide-mobile {
        width: 105%;
      }
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

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 0 ${space(3)};
  position: relative;

  ${media.min('tablet')`
    padding: 0 ${space(6)};
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

const Row = styled.div<{ reverse?: boolean; flex?: boolean; dark?: boolean }>`
  background-color: ${({ dark }) => (dark ? `${COLOR_NEUTRO_300}` : 'transparent')};
  padding: ${({ dark }) => (dark ? `${space(9)} ${space(3)} ${space(10)}` : `0 0 ${space(8)} 0`)};
  position: relative;
  text-align: left;
  width: 100%;

  .title-lg,
  strong {
    font-weight: 500;
  }

  .title-lg {
    color: ${({ dark }) => (dark ? `${COLOR_NEUTRO_700}` : `${COLOR_NEUTRO_600}`)};
    margin-bottom: ${space(2)};
  }

  .title-lg.definition {
    ${media.min('tablet')`
      text-align: center;
    `}
  }

  ${media.min('tablet')`
    padding: ${({ dark }) => (dark ? `${space(10)} 0 ${space(15)}` : `0 0 ${space(15)} 0`)};
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

export { Content, Row, Column, Billboard, Wrapper, Banner, Sections };
