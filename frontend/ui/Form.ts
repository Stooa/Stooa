/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { Form } from 'formik';

import Alert from 'ui/Alert';
import { space, media, rems } from 'ui/helpers';
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_PURPLE_500,
  COLOR_RED_500,
  FONT_BASE_SIZE
} from 'ui/settings';
import { TEXT_SM, TEXT_XXS } from 'ui/Texts';

interface Props {
  full?: boolean;
}

const FormikForm = styled(Form)`
  margin-top: ${space(4)};
  max-width: ${({ full }: Props) => (full ? 'none' : rems(BREAKPOINTS.form))};
  text-align: left;
  width: 100%;

  &:not(:last-child)  {
    margin-bottom: ${space(4)};
  }

  fieldset {
    margin: ${space(3.5)} 0;

    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }

    > *:not(:last-child) {
      margin-bottom: ${space(2)};
    }
  }

  .form__footer {
    margin-top: ${space(3.5)};
    text-align: center;

    a {
      color: ${COLOR_PURPLE_500};
    }
  }

  a {
    text-decoration: underline;
  }

  ${media.min('tablet')`
    .fieldset-inline {
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  `}
`;

const InputStyled = styled.div`
  position: relative;
  width: 100%;

  ${media.min('tablet')`
    &.sm {
      width: calc(50% - ${space(0.5)});

      input,
      textarea,
      select {
        padding-right: ${space(4.5)}
      }
    }
  `}

  svg { pointer-events: none; }

  .dropdown-icon {
    height: ${rems(16)};
    position: absolute;
    right: ${space(2)};
    top: ${space(2.5)};
    width: ${rems(16)};
  }

  .icon,
  .dropdown-icon {
    z-index: 1;

  }

  &.disabled {
    .icon path,
    .dropdown-icon path { fill: ${COLOR_NEUTRO_500}; }

    input:disabled,
    textarea:disabled,
    select:disabled {
      border: 1px solid ${COLOR_NEUTRO_300};
      color: ${COLOR_NEUTRO_600};

      & + label { color: ${COLOR_NEUTRO_600}; }

      .icon path {
        color: ${COLOR_NEUTRO_500};
      }
    }
  }

  &.withicon {
    input,
    select,
    &.datepicker input { padding-left: ${space(6)}; }

    label { left: ${space(6)}; }

    .icon {
      height: ${space(4)};
      left: ${space(1.25)};
      position: absolute;
      top: ${space(1.35)};
      width: ${space(4)};
    }
  }

  &.textarea {
    height: ${space(14)};

  }

  input,
  textarea,
  select {
    background-color: ${COLOR_NEUTRO_300};
    border: 1px solid ${COLOR_NEUTRO_500};
    color: ${COLOR_NEUTRO_700};
    border-radius: ${BORDER_RADIUS};
    padding: ${space(2.75)} ${space(6)} ${space(0.4)} ${space(2)};
    width: 100%;

    ${media.min('tablet')`
      ${TEXT_SM}
    `}

    &:focus {
      outline: none;
      border: 1px solid ${COLOR_NEUTRO_700};
    }

    &.invalid { border-color: ${COLOR_RED_500}; }
  }

  input,
  select { height: ${space(6.5)}; }

  textarea {
    height: 100%;
    overflow-y: auto;
    padding-top: ${space(3)};
    resize: none;
  }

  label {
    color: ${COLOR_NEUTRO_600};
    font-size: ${FONT_BASE_SIZE}px;
    left: ${space(2)};
    line-height: 100%;
    pointer-events: none;
    position: absolute;
    top: ${space(2.25)};
    transition: .1s ease-out;
  }

  input:focus,
  input.filled,
  textarea:focus,
  textarea.filled {
    + label {
      color: ${COLOR_NEUTRO_700};
      top: ${space(1.3)};

      ${TEXT_XXS}
    }
  }

  select + label,
  &.datepicker label.small {
      color: ${COLOR_NEUTRO_700};
      top: ${space(1.3)};

      ${TEXT_XXS}
    }
  }

  .help {
    font-size: ${rems(12)};
    margin-top: ${space(0.5)};
    padding: 0 ${space(2)};
  }

  &:not(:last-child) .help {
    margin-bottom: ${space(2)};
    }
`;

const DatePickerStyled = styled(InputStyled)`
  cursor: pointer;

  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker-popper {
    z-index: 2;
  }
`;

const CheckboxStyled = styled.div`
  input[type='checkbox'] {
    background: transparent;
    opacity: 0;
    position: absolute;
    width: auto;

    & + label {
      cursor: pointer;
      display: inline-block;
      padding: 0;
      padding-left: ${space(3.5)};
      position: relative;
    }

    & + label::before {
      background-color: ${COLOR_NEUTRO_300};
      border: 1px solid ${COLOR_NEUTRO_500};
      border-radius: ${rems(3)};
      content: '';
      display: inline-block;
      height: ${rems(20)};
      left: 0;
      position: absolute;
      top: 0;
      vertical-align: text-top;
      width: ${rems(20)};
    }

    &:checked + label::after {
      border: solid ${COLOR_NEUTRO_700};
      border-width: 0 3px 3px 0;
      content: '';
      height: ${rems(11)};
      left: ${rems(7)};
      position: absolute;
      top: ${rems(3)};
      transform: rotate(45deg);
      transition: opacity 0.1s ease-out;
      width: ${rems(7)};
      will-change: opacity;
    }
  }
`;

const FormError = styled(Alert)`
  flex-direction: column;
  margin-bottom: ${space(-2)};
  margin-top: ${space(2)};
`;

export { CheckboxStyled, DatePickerStyled, FormError, InputStyled };
export default FormikForm;
