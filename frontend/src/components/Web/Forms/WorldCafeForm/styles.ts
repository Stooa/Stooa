/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_MD, mediumWeight } from '@/ui/Texts';
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_GREEN_500,
  COLOR_GREEN_600,
  COLOR_NEUTRO_100,
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
  padding: 1.5rem 1rem;
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
  align-items: center;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2rem;

  & div {
    width: 100%;
    height: 1px;
    border-top: 1px solid ${COLOR_NEUTRO_400};
  }

  & > li {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.disabled {
      opacity: 0.5;
    }

    & > .status {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid ${COLOR_NEUTRO_400};
      color: ${COLOR_NEUTRO_100};
      background-color: ${COLOR_GREEN_600};

      ${BODY_MD};
      ${mediumWeight};

      &.done {
        border-color: ${COLOR_GREEN_500};
        background-color: transparent;
      }

      & > svg {
        padding-top: 2px;
        width: 18px;
        height: 18px;
      }
    }

    &#basics {
      cursor: pointer;
      &:hover {
        color: ${COLOR_PURPLE_500};
      }
    }
  }
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 1;
`;

export { StyledWorldCafeForm, StyledAddButton, StyledStepper, StyledDeleteButton };
