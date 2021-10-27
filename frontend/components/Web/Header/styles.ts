/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { TEXT_SM } from 'ui/Texts';
import { media, space } from 'ui/helpers';

const Navigation = styled.nav`
  align-items: center;
  display: flex;
  justify-content: flex-end;

  ${TEXT_SM}

  .secondary {
    display: none;
  }

  ${media.min('tablet')`
    > *:not(:last-child) {
      margin-right: ${space(3)};
    }

    .secondary { display: block; }
  `}
`;

export default Navigation;
