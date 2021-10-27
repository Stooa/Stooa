/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { COLOR_NEUTRO_900, COLOR_NEUTRO_100 } from 'ui/settings';
import { TEXT_SM } from 'ui/Texts';
import { space } from 'ui/helpers';

const Title = styled.div`
  margin: 0 0 ${space(3)};
`;

const List = styled.ol`
  counter-reset: custom-counter;
  list-style: none;
  margin: 0 0 ${space(12)};
  padding-left: ${space(5)};

  li {
    counter-increment: custom-counter;
    margin: 0 0 ${space()};
    position: relative;

    &::before {
      ${TEXT_SM};

      align-items: center;
      background: ${COLOR_NEUTRO_900};
      border-radius: 50%;
      content: counter(custom-counter, decimal);
      color: ${COLOR_NEUTRO_100};
      display: inline-flex;
      height: 23px;
      justify-content: center;
      left: ${space(-5)};
      line-height: 1;
      position: absolute;
      top: 5px;
      width: 23px;
    }
  }
`;

export { List, Title };
