/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import Delete from '@/ui/svg/delete.svg';
import { rems, space } from '@/ui/helpers';

type TProps = {
  left?: boolean;
  right?: boolean;
};

const getIconCSS = (props?: TProps) => css`
  display: inline-block;
  ${props?.right && `margin-left: ${space()}`};
  ${props?.left && `margin-right: ${space()}`};

  path {
    fill: currentColor;
  }
`;

const getSize = s => {
  let size;
  switch (s) {
    case 'small':
      size = 14;
      break;
    case 'large':
      size = 24;
      break;
    default:
      size = 18;
      break;
  }

  return css`
    height: ${rems(size)};
    width: ${rems(size)};
  `;
};

export {  getIconCSS };
