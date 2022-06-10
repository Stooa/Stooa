/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FloatFast, FloatStandard } from '@/ui/animations/motion/reactions';
import { media, space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledReactionsReciever = styled.div`
  position: absolute;
  bottom: 0;
  left: -${space(3)};
  width: 100vw;
  height: ${space(10)};

  ${media.min('tablet')`
    width: 50vw;
    margin: 0 auto;

    left: 50%;
    transform: translateX(-50%);
  `}

  ${FloatFast}
  ${FloatStandard}
`;

export { StyledReactionsReciever };
