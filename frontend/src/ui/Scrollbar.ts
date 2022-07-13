/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';
import { COLOR_NEUTRO_400 } from './settings';

export const scrolllbarStyle = css`
  scrollbar-color: ${COLOR_NEUTRO_400} transparent;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-thumb {
    /* Foreground */
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: ${COLOR_NEUTRO_400};
  }

  &::-webkit-scrollbar-track {
    /* Background */
    background: transparent;
  }
`;
