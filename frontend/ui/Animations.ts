/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

import { media } from 'ui/helpers';

const Animations = css`
  .animate .animate-item,
  .billboard-animate .animate-item {
    opacity: 0;
    position: relative;
    transform: translateY(20px);
    will-change: opacity, transform;

    ${media.min('tablet')`
      transform: translateY(30px);
    `}
  }
`;

export default Animations;
