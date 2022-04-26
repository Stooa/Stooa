/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';
import { BREAKPOINTS, FONT_BASE_SIZE, SPACE } from '@/ui/settings';

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  if (hex[0] === '#') {
    hex = hex.substr(1);
  }
  if (hex.length === 3) {
    const hr = hex[0];
    const hg = hex[1];
    const hb = hex[2];

    return hexToRgb(`${hr}${hr}${hg}${hg}${hb}${hb}`);
  }

  const [r, g, b] = [0, 2, 4]
    .map(offset => hex.substring(offset, offset + 2))
    .map(hexCh => parseInt(hexCh, 16));

  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return [r, g, b]
    .map(decCh => Math.max(0, Math.min(255, decCh)).toString(16))
    .map(hexCh => (hexCh.length === 1 ? `0${hexCh}` : hexCh))
    .join('');
};

const bgGradient = (rotation: string, color1: string, color2: string) =>
  `linear-gradient(${rotation}, ${color1} 0%, ${color2} 100%)`;

const getRatio = (originalWidth: number, originalHeight: number, width = 0, height = 0) => {
  let finalHeight;
  let finalWidth;

  if (width > 0) {
    finalHeight = Math.ceil((width / originalWidth) * originalHeight) + 'px';
    finalWidth = `${width}px`;
  } else {
    finalHeight = `${height}px`;
    finalWidth = Math.ceil((height / originalHeight) * originalWidth) + 'px';
  }
  return `
    height: ${finalHeight};
    width: ${finalWidth};
  `;
};

const columns = (number: number, spaces = 1, direction = 'default') => `
  ${
    direction === 'default'
      ? `
      width: calc((100% - ${space(spaces * (number - 1))}) / ${number});
      &:nth-child(n) { margin-right: ${space(spaces)}; }
      &:nth-child(${number}n) { margin-right: 0; }
      `
      : `
      width: calc((100% - ${space(spaces * (number - 1))}) / ${number});
      &:nth-child(n) { margin-left: ${space(spaces)}; }
      &:nth-child(${number}n) { margin-left: 0; }
    `
  }
`;
/**
 * Convert px to Rems
 * @param {number} px
 * @returns rems
 */
const rems = (n: number | string) =>
  typeof n === 'string' ? `${parseInt(n, 10) / FONT_BASE_SIZE}rem` : `${n / FONT_BASE_SIZE}rem`;

const pixelate = (n: number | string) => (n !== 0 ? `${n}px` : n);

const space = (n = 1) => rems(SPACE * n);

const getSizeFromBreakpoint = (value: string, max = false) => {
  let mq;
  if (BREAKPOINTS[value]) {
    mq = max ? BREAKPOINTS[value] - 1 : BREAKPOINTS[value];
  } else {
    // tslint:disable-next-line:no-console
    console.error('No valid breakpoint or size specified for media.');
  }
  return mq ? pixelate(mq) : '0';
};

const generateMedia = () => {
  const max =
    (breakpoint: string) =>
    (...args) =>
      css`
        @media (max-width: ${getSizeFromBreakpoint(breakpoint, true)}) {
          ${css.call(null, ...args)};
        }
      `;

  const min =
    (breakpoint: string) =>
    (...args) =>
      css`
        @media (min-width: ${getSizeFromBreakpoint(breakpoint)}) {
          ${css.call(null, ...args)};
        }
      `;

  const between =
    (firstBreakpoint: string, secondBreakpoint: string) =>
    (...args) =>
      css`
        @media (min-width: ${getSizeFromBreakpoint(
            firstBreakpoint
          )}) and (max-width: ${getSizeFromBreakpoint(secondBreakpoint, true)}) {
          ${css.call(null, ...args)};
        }
      `;

  return {
    between,
    max,
    min
  };
};

const media = generateMedia();

export { bgGradient, columns, getRatio, hexToRgb, media, pixelate, rems, rgbToHex, space };
