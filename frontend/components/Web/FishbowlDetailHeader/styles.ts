/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space } from 'ui/helpers';
import { TEXT_SM } from 'ui/Texts';

const Navigation = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;

  ${TEXT_SM}

  > *:not(:last-child) {
    margin-right: ${space(3)};
  }
`;

const Avatar = styled.div`
  align-items: center;
  display: flex;
  font-weight: 500;
  justify-content: flex-start;

  svg {
    margin-right: ${space()};

    path {
      fill: currentColor;
    }
  }
`;

export { Avatar };
export default Navigation;
