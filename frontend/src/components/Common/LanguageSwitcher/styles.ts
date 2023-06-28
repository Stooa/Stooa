/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_300, COLOR_NEUTRO_400 } from '@/ui/settings';

const Languages = styled.div<{ location?: 'modal' | 'default' }>`
  display: inline-block;
  position: relative;
  max-width: 20ch;

  &[aria-disabled='true'] {
    opacity: 0.5;
    pointer-events: none;
  }

  select {
    width: 100%;
    background-color: ${({ location }) =>
      location === 'modal' ? COLOR_NEUTRO_300 : 'transparent'};
    border: ${({ location }) => (location === 'modal' ? `1px solid ${COLOR_NEUTRO_400}` : 'none')};
    border-radius: 0;
    color: inherit;
    cursor: pointer;
    line-height: 1.2;
    padding-block: ${space(1)};
    padding-inline: ${space(1.5)};
    padding-inline-end: ${space(3)};
    transition: background-color 0.3s ease-in-out;
    border-radius: ${BORDER_RADIUS};

    &:hover {
      background-color: ${COLOR_NEUTRO_300};
    }

    &:focus {
      outline: none;
    }
  }

  svg {
    height: ${space(1.5)};
    position: absolute;
    pointer-events: none;
    right: 8px;
    top: calc(50%);
    transform: translateY(-50%);
    width: ${space(1.5)};

    path {
      fill: currentColor;
    }
  }
`;

export default Languages;
