/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { BREAKPOINTS, COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const Content = styled.main`
  display: flex;
  /* Setting the max-width of the content to the value of the reader breakpoint. */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: ${BREAKPOINTS.tablet}px;
  width: 100%;
  padding: ${space(8)} 0;

  & .friend-image,
  & .description,
  & .reasons {
    margin-bottom: ${space(4)};
  }

  & .reasons {
    position: relative;
    background-color: ${COLOR_NEUTRO_100};
    padding: ${space(2)} ${space(5)};
    border-radius: 5px;

    & svg {
      width: 20px;
      height: 20px;
    }

    & ul {
      list-style: disc;
      text-align: left;
      padding-left: ${space(3)};
    }

    & svg {
      position: absolute;
      left: ${space(2)};
      top: ${space(2)};
    }
  }

  ${media.min('tablet')`
    & svg {
      height: 240px;
      width: 240px;
    }
  `}
`;

export { Content };
