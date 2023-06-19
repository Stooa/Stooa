/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_PURPLE_500
} from '@/ui/settings';
import styled from 'styled-components';

const StyledWorldCafeForm = styled.form`
  width: 100%;
  max-width: ${BREAKPOINTS.reader}px;

  & > #step-general,
  & > #step-questions {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    & > * + * {
      margin-top: 1em;
    }

    flex-shrink: 0;
    justify-content: space-between;
  }

  & > #step-questions {
    & > .questions {
      width: 100%;

      & > .question {
        position: relative;

        &:not(:last-child) {
          margin-bottom: 2rem;
        }
      }
    }

    & textarea.description {
      display: none;
      margin-top: 0.45rem;

      &.show {
        display: block;
      }
    }
  }
`;

const StyledAddButton = styled.button`
  display: block;
  width: 100%;
  padding: 2rem 1rem;
  background-color: ${COLOR_NEUTRO_200};
  border: 1px dashed ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
  transition: background-color, transform, 0.2s ease-out;
  box-shadow: 0 0 0 0 ${COLOR_NEUTRO_500};

  &:hover {
    transform: translateY(-2px);
    background-color: ${COLOR_NEUTRO_300};
    box-shadow: 0 6px 10px -6px ${COLOR_NEUTRO_500};
  }
`;

const StyledStepper = styled.ul`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2rem;

  & > li#basics {
    cursor: pointer;
    &:hover {
      color: ${COLOR_PURPLE_500};
    }
  }
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export { StyledWorldCafeForm, StyledAddButton, StyledStepper, StyledDeleteButton };
