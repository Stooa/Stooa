/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { BORDER_RADIUS } from '@/ui/settings';
import { WARNING_STYLES } from '@/ui/Alert';
import { rems, space } from '@/ui/helpers';

const Container = styled.div<{ show: boolean }>`
  ${WARNING_STYLES}

  align-items: center;
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  margin: 0 auto ${({ show }) => (show ? space() : space(-1))};
  max-width: ${rems(640)};
  opacity: ${({ show }) => (show ? 1 : 0)};
  padding: ${space(2)} ${space(3)};
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 100%;
  z-index: 5;

  span {
    display: block;
    text-align: left;
    width: 100%;
  }
`;

const Cross = styled.button`
  cursor: pointer;
  height: ${space(2)};
  margin: 0 0 0 ${space(2)};
  pointer-events: initial;

  svg {
    height: ${space(2)};
    width: ${space(2)};

    path {
      fill: currentColor;
    }
  }
`;

export { Container, Cross };
