/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { BODY_SM } from '@/ui/Texts';
import { space } from '@/ui/helpers';

const Navigation = styled.nav`
  align-items: center;
  display: flex;
  justify-content: flex-end;

  ${BODY_SM}

  > *:not(:last-child) {
    margin-right: ${space(2)};
  }
`;

export default Navigation;
