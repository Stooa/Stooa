/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import styled from 'styled-components';

const StyledList = styled.ul`
  position: relative;
  padding: 0;

  & li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${space(2)} ${space(4)};
    margin-bottom: ${space(6)};

    & > .with-icon {
      display: flex;
      align-items: center;
      gap: ${space(4)};
    }

    & h5 {
      margin-bottom: ${space(2)};
    }
  }
`;

export { StyledList };
