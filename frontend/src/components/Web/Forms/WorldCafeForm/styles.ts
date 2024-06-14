/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_MD, mediumWeight } from '@/ui/Texts';
import { space } from '@/ui/helpers';
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_GREEN_200,
  COLOR_GREEN_600,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_RED_600
} from '@/ui/settings';
import styled from 'styled-components';

const StyledWorldCafeForm = styled.form`
  width: 100%;
  max-width: ${BREAKPOINTS.reader}px;
  padding-bottom: ${space(26)};

  & h3 {
    ${mediumWeight};
  }

  & fieldset {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    flex-shrink: 0;
    justify-content: space-between;

    & > * + *:not(button) {
      margin-top: 1rem;
    }
  }

  & #step-questions {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    & .questions {
      width: 100%;
    }

    & .question {
      position: relative;

      &:not(:last-child) {
        margin-bottom: 2rem;
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

  & .next-step-button svg {
    height: 1rem;
  }

  & .react-datepicker__tab-loop .react-datepicker__triangle {
    left: -10px !important;
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

  margin-top: 2rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background-color: ${COLOR_NEUTRO_300};
    box-shadow: 0 6px 10px -6px ${COLOR_NEUTRO_500};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${COLOR_NEUTRO_700};
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
    border-top: 2px solid ${COLOR_NEUTRO_400};

    &.green {
      border-top: 2px solid ${COLOR_GREEN_200};
    }
  }

  & > li {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.disabled {
      color: ${COLOR_NEUTRO_500};

      & > .status {
        border: 1px solid ${COLOR_NEUTRO_500};
        background-color: transparent;
      }
    }

    & > .status {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;

      &.highlighted {
        border: 1px solid ${COLOR_GREEN_600};
        color: ${COLOR_NEUTRO_100};
        background-color: ${COLOR_GREEN_600};
      }

      ${BODY_MD};
      ${mediumWeight};

      &.done {
        border: 1px solid ${COLOR_GREEN_600};
        background-color: transparent;
      }

      & > svg {
        width: 18px;
        height: 18px;
      }
    }

    &#basics:not(.current) {
      cursor: pointer;
      &:hover {
        color: ${COLOR_GREEN_600};
      }
    }
  }
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  transition: color 0.2s ease-out;
  color: ${COLOR_NEUTRO_600};

  & svg {
    pointer-events: none;
    & path {
      fill: currentColor;
    }
  }

  &:hover {
    color: ${COLOR_RED_600};
  }

  &:focus-visible {
    outline: 1px solid ${COLOR_NEUTRO_700};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${COLOR_NEUTRO_500};
  }
`;

export { StyledWorldCafeForm, StyledAddButton, StyledStepper, StyledDeleteButton };
