/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const StyledTooltip = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 24px;
  width: max-content;
  padding: ${space()} ${space(2)};
  color: ${COLOR_NEUTRO_100};
  background-color: hsla(0, 59%, 0%, 0.65);
  backdrop-filter: blur(12px);
  border-radius: 46px;

  transition: opacity 0.3s ease-in-out;
  opacity: 0;

  /* POSITIONS */
  &.top {
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(100% + ${space(1.25)});

    &.arrow::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: hsla(0, 59%, 0%, 0.65) transparent transparent transparent;
    }
  }

  &.bottom {
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + ${space(1.25)});

    &.arrow::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent hsla(0, 59%, 0%, 0.65) transparent;
    }
  }

  &.left {
    right: calc(100% + ${space(1.25)});
    top: 50%;
    transform: translateY(-50%);

    &.arrow::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent hsla(0, 59%, 0%, 0.65);
    }
  }

  .right {
    left: calc(100% + ${space(1.25)});
    top: 50%;
    transform: translateY(-50%);

    &.arrow::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: transparent hsla(0, 59%, 0%, 0.65) transparent transparent;
    }
  }

  &.show {
    transition: opacity 0.3s 0.3s ease-in-out;
    opacity: 1;
  }
`;

export { StyledTooltip };
