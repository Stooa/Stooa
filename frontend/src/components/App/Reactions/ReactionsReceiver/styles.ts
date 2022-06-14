/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FloatFast, FloatStandard } from '@/ui/animations/motion/reactions';
import { media, rems, space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledReactionsReciever = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${space(10)};

  ${media.min('tablet')`
    bottom: ${space(7)};
    width:100%;

    margin: 0 auto;

  `}

  &.drawer-open {
    ${media.between('tablet', 'tabletLarge')`
    &.drawer-open {
      width: calc(100vw - ${rems(335)});
    }
  `}

    ${media.min('tabletLarge')`
    &.drawer-open {
      width: calc(100vw - ${rems(355)});
    }
  `}
  }

  ${FloatFast}
  ${FloatStandard}
`;

export { StyledReactionsReciever };
