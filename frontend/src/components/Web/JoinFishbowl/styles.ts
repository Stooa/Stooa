/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, media } from '@/ui/helpers';

const JoinFishbowlStyled = styled.div`
  width: 100%;
  .join-buttons {
    /* max-width: 520px; */
    margin: ${space(3)} 0 0;

    > * {
      margin: 0 0 ${space(2)};
    }

    ${media.min('tablet')`
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: row;
    * + * {
      margin-left: ${space(2)};
    }
    `}

    flex-direction: column;
  }
`;

export { JoinFishbowlStyled };
