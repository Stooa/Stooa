/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space, media } from 'ui/helpers';

const Languages = styled.div`
  position: relative;

  select {
    background: transparent;
    border: none;
    border-radius: 0;
    color: inherit;
    cursor: pointer;
    line-height 1.2;
    padding-right: ${space(2.5)};

    &:focus {
      outline: none;
    }
  }

  svg {
    position: absolute;
    pointer-events: none;
    right: 0;

    path { fill: currentColor; }
  }

  ${media.max('phone')`
    margin: ${space(1.5)} 0;
  `}
`;

export default Languages;
