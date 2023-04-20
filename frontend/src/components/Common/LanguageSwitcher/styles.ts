/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { space, media } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_300 } from '@/ui/settings';

const Languages = styled.div<{ backgroundColor: string }>`
  display: inline-block;
  padding: ${space()} 0;
  position: relative;
  max-width: 20ch;

  &[aria-disabled='true'] {
    opacity: 0.5;
    pointer-events: none;
  }

  select {
    width: 100%;
    background-color: ${({ backgroundColor }) =>
      backgroundColor === 'white' ? COLOR_NEUTRO_100 : 'transparent'};
    border: none;
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

  ${media.max('phone')`
    margin: ${space(1.5)} 0;
  `}
`;

export default Languages;
