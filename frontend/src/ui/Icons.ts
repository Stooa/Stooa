/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

import { space } from '@/ui/helpers';

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

export { getIconCSS };
