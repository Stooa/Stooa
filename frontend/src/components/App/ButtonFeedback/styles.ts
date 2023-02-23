/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_300, COLOR_NEUTRO_600, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledButtonFeedback = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: ${space(1)} ${space(2)};
  background-color: transparent;
  transition: background-color 0.2s ease-out;
  color: ${COLOR_NEUTRO_600};
  border-radius: 60px;

  & .text {
    margin-right: ${space(1)};
  }

  & .chevron {
    height: 14px;
    & svg {
      width: 14px;
      height: 14px;
    }
    transform-origin: 50% 60%;
    transform: rotate(${({ active }) => (active ? '0deg' : '180deg')});
  }

  & > svg {
    margin-right: ${space(0.5)};
  }

  &:hover {
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_700};

    & > svg path {
      stroke: currentColor;
    }

    & > svg circle,
    & > .chevron svg path {
      fill: currentColor;
    }
  }
`;

const StyledFeedbackWrapper = styled.div`
  display: none;

  ${media.min('desktop')`
    display: block;
    position: absolute;
    bottom: ${space(0)};
    right: ${space(2)};
    z-index: 40;


    &.drawer-opened {
      right: ${space(46)};
    }

    & .alert {
      transform: scale(0.8);
      position: absolute;
      top: 0;
      left: 29px;
    }
  `}
`;

export { StyledButtonFeedback, StyledFeedbackWrapper };