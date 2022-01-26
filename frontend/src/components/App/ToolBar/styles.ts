/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { media } from '@/ui/helpers';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(90px, 100px));
  justify-content: center;
  justify-items: stretch;
  align-items: start;
  margin: auto;
  width: 100%;

  ${media.max('tablet')`
    &.moderator { padding-left: 0; }
  `}

  button {
    margin: 0;
    max-width: 100%;
  }
`;

export { Container };
