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
import {
  BORDER_RADIUS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import { TEXT_SM } from '@/ui/Texts';

const CustomToast = styled.div`
  ${TEXT_SM}
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + ${space(2)});

  background-color: ${COLOR_NEUTRO_100};
  color: ${COLOR_NEUTRO_800};
  border-radius: ${BORDER_RADIUS};
  padding: ${space(2)} ${space(3)};

  overflow: hidden;
  z-index: 9;

  ${media.max('tablet')`
      width: 92%;
      left: 50%;
      transform: translateX(-50%);
      .Toastify__toast {border-radius: 4px;}
    `}

  svg {
    color: ${COLOR_NEUTRO_700};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: ${COLOR_NEUTRO_600};
    height: 5px;
    width: 100%;
  }
`;

export { CustomToast };
