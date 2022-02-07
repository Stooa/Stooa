/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, rems } from '@/ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  BORDER_RADIUS,
  COLOR_PURPLE_600
} from '@/ui/settings';

const InfoStyled = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  position: relative;

  .title {
    max-width: ${rems(340)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Icon = styled.button`
  margin-left: ${space()};

  .icon-wrapper {
    align-items: center;
    background-color: ${COLOR_NEUTRO_400};
    border: 1px solid transparent;
    border-radius: 50%;
    display: flex;
    height: ${space(4)};
    justify-content: center;
    transition: background-color 0.1s ease-out;
    width: ${space(4)};
    will-change: background-color;
  }

  svg path {
    fill: ${COLOR_NEUTRO_600};
  }

  .icon-wrapper:hover {
    border-color: currentColor;
  }

  &.active .icon-wrapper {
    border-color: currentColor;
  }
`;

const Description = styled.div`
  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_700};
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  color: ${COLOR_NEUTRO_700};
  width: ${rems(340)};
  padding: ${space(2)};
  position: absolute;
  top: 125%;
  left: 70%;
  z-index: 10;

  .description__title {
    margin-bottom: ${space(1)};
  }

  .info-text {
    margin-bottom: ${space(2)};
  }

  .description__share-text {
    color: ${COLOR_PURPLE_600};
    margin-top: ${space(1)};
  }
`;

export { Icon, Description };
export default InfoStyled;
