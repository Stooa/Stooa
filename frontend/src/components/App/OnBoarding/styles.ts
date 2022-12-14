/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import { CustomToast } from '@/ui/CustomToast';
import { space, media, rems } from '@/ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_800
} from '@/ui/settings';

const OnboardingWrapper = styled.div`
  ${media.min('tablet')`
    position: relative;
  `}
`;

const Icon = styled.button`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: ${space()};
`;

const Tooltip = styled(CustomToast)`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: -65px;
  transform: translateX(-50%);
  margin: 0;
  width: 100%;
  max-width: 350px;

  z-index: 10;
  box-shadow: var(--shadow-elevation-medium);

  ${media.min('tablet')`
    width: 60ch;
    bottom: -75px;
    left: -20%;
    transform: translateX(0);
  `}

  button {
    height: ${rems(20)};
    margin-left: ${space()};
    width: ${rems(20)};

    svg {
      height: ${rems(16)};
      width: ${rems(16)};

      path {
        fill: ${COLOR_NEUTRO_600};
      }
    }
  }
`;

const Slider = styled.div`
  &,
  .slick-slider,
  .slick-track,
  .slick-list,
  .slick-slide,
  .slick-slide > div,
  .slide {
    height: 100%;
  }

  .slick-slide {
    &:not(.slick-active) {
      pointer-events: none;
    }
    &:focus {
      outline: none;
    }
  }

  .slick-dots {
    bottom: ${space(2)};
    left: ${space(3)};
    position: absolute;
    width: auto;

    ${media.min('tablet')`
      bottom: calc(${space(3)} - ${rems(7)});
      left: calc(${space(6)} - ${rems(7)});
    `}

    ${media.min('maxWidth')`
      bottom: calc(${space(4)} - ${rems(7)});
      left: ${space(8)};
    `}

    li {
      height: ${rems(25)};
      margin: 0;
      width: ${rems(25)};

      button {
        height: ${rems(25)};
        width: ${rems(25)};

        &::before {
          background: ${COLOR_NEUTRO_400};
          border-radius: 50%;
          color: transparent;
          content: '';
          height: ${rems(8)};
          left: 50%;
          opacity: 1;
          top: 50%;
          transform: translate(-50%, -50%);
          width: ${rems(8)};
        }
      }

      &.slick-active button::before {
        background: ${COLOR_NEUTRO_600};
        height: ${rems(10)};
        width: ${rems(10)};
      }
    }
  }

  .slick-arrow {
    background: ${COLOR_NEUTRO_100};
    border-radius: 50%;
    height: ${space(5.75)};
    width: ${space(5.75)};

    &.slick-disabled {
      display: none !important;
    }

    &::before {
      display: none;
    }

    ${media.max('tabletLarge')`
      display: none !important;
    `}

    svg {
      height: ${rems(20)};
      position: relative;
      top: ${rems(-1)};
      width: ${rems(20)};

      path {
        fill: ${COLOR_NEUTRO_600};
      }
    }

    &.slick-next {
      right: auto;

      svg {
        left: ${rems(2)};
      }

      ${media.min('tablet')`
        left: calc(100% + ${space(2)});
      `}
    }

    &.slick-prev {
      left: auto;

      svg {
        right: ${rems(2)};
      }

      ${media.min('tablet')`
        right: calc(100% + ${space(2)});
      `}
    }
  }
`;

const images = css`
  .right {
    position: relative;

    img {
      position: absolute;
    }
  }

  &.slide-0 {
    .img-1 {
      bottom: 11.4%;
      height: auto;
      right: 0;
      width: 92.6%;
    }

    .img-2 {
      bottom: ${space(3)};
      height: ${rems(115)};
      left: ${space(-1.5)};
      width: ${rems(115)};
    }
  }

  &.slide-3 {
    .img-1 {
      bottom: 0;
      height: 81.2%;
      right: ${space(4.5)};
      width: auto;
    }

    .img-2 {
      bottom: ${space(8)};
      height: ${rems(160)};
      left: ${space(-2)};
      width: auto;
    }
  }

  &.moderator {
    &.slide-1 {
      .img-1 {
        bottom: 0;
        height: 81.2%;
        right: ${space(4.5)};
        width: auto;
      }

      .img-2 {
        bottom: 0;
        height: 51.2%;
        left: ${space(-4.5)};
        width: auto;
      }
    }

    &.slide-2 {
      .img-1 {
        bottom: 0;
        height: 81.2%;
        right: ${space(4.5)};
        width: auto;
      }

      .img-2 {
        bottom: ${space(2.5)};
        height: 31.2%;
        left: ${space(-4.5)};
        width: auto;
      }
    }

    &.slide-4 {
      .img-1 {
        bottom: 0;
        height: 81.2%;
        right: ${space(4.5)};
        width: auto;
      }

      .img-2 {
        bottom: 0;
        height: 51.2%;
        left: ${space(-4.5)};
        width: auto;
      }
    }
  }

  &.participant {
    &.slide-1 {
      .img-1 {
        top: 19.7%;
        height: auto;
        left: ${space(-3)};
        width: 100%;
      }

      .img-2 {
        top: 11.6%;
        height: ${rems(144)};
        left: calc(50% - ${rems(144 / 2)} - ${space(3)});
        width: ${rems(144)};
      }
    }

    &.slide-3 {
      .img-1 {
        bottom: 0;
        height: 81.2%;
        right: ${space(4.5)};
        width: auto;
      }
    }
  }
`;

const Slide = styled.div`
  display: block !important;
  height: 100%;
  text-align: left;
  width: 100%;

  .text {
    color: ${COLOR_NEUTRO_800};
  }

  .right {
    display: none;
  }

  .left {
    padding: ${space(6)} ${space(3)};

    *:not(:last-child) {
      margin-bottom: ${space(2)};
    }

    ul {
      li {
        position: relative;

        &::before {
          background: currentColor;
          border-radius: 50%;
          content: '';
          height: 2px;
          transform: translateY(-4px);
          width: 2px;
          display: inline-block;
          margin-right: ${space()};
          position: relative;
        }
      }
    }
  }

  .animate {
    position: relative;
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }

  ${images}

  ${media.min('tablet')`
    align-items: stretch;
    display: flex !important;
    justify-content: space-between;
    width: 100%;

    .right,
    .left {
      padding: ${space(3)} ${space(6)};
      width: 50%;
    }

    .right {
      display: block;
      padding-left: 0;
    }
  `}

  ${media.min('tabletLarge')`
    .right,
    .left {
      padding: ${space(4)} ${space(2)} ${space(6)} ${space(5)};
    }

    .right { padding-left: 0; }
    .left { padding-right: ${space(8)}; }
  `}

  ${media.min('maxWidth')`
    .right,
    .left {
      padding: ${space(6)} ${space(7)};
    }

    .right { padding-left: 0; }
  `}
`;

export { Icon, Slider, Slide, Tooltip };
export default OnboardingWrapper;
