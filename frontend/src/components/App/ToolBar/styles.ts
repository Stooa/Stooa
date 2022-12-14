/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_400 } from '@/ui/settings';

const StyledToolbar = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(20%, 100px));
  justify-content: center;
  justify-items: stretch;
  align-items: start;
  margin: auto;
  width: 100%;
  padding: ${space(1.2)} ${space(2)} ${space()} ${space(2)};

  &.moderator.introduction {
    ${media.min('tablet')`
      grid-template-columns: repeat(6, minmax(16.66%, 100px));
    `}
  }

  ${media.min('tablet')`
    padding: 0 ${space(3)};
  `}

  ${media.max('tablet')`
    background-color: ${COLOR_NEUTRO_400};
  `}

  & > button {
    margin: 0;
    max-width: 100%;
  }
`;

export { StyledToolbar };
