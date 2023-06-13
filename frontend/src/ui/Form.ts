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

import Alert from '@/ui/Alert';
import { space, media, rems } from '@/ui/helpers';
import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_GREEN_500,
  COLOR_GREEN_600,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_RED_500,
  FONT_BASE_SIZE
} from '@/ui/settings';
import { BODY_SM, BODY_XS } from '@/ui/Texts';

interface Props {
  $isFull?: boolean;
}

const FormikForm = styled(Form)`
  position: relative;
  max-width: ${({ $isFull }: Props) => ($isFull ? 'none' : rems(BREAKPOINTS.form))};
  text-align: left;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: ${space(4)};
  }

  fieldset {
    margin-bottom: ${space(3.5)};

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;

      span {
        position: absolute;
        width: 100%;
        text-align: center;
        color: ${COLOR_GREEN_600};
        margin: 0;

        &.success-message-bottom {
          ${media.min('tablet')`
            bottom: -3.5ch;
          `}
          bottom: 3.25rem;
        }
      }
    }

    & > *:not(:last-child) {
      margin-bottom: ${space(2)};
    }

    &.submit-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;

      input {
        margin-bottom: 0;
      }
    }
  }

  .form__footer {
    margin-top: ${space(3.5)};
    text-align: center;
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

  svg {
    pointer-events: none;
    color: ${COLOR_NEUTRO_700};
  }

  .dropdown-icon {
    height: ${rems(16)};
    width: ${rems(16)};
    position: absolute;
    right: ${space(2)};
    top: ${space(2.5)};
  }

  .icon,
  .dropdown-icon {
    z-index: 1;
  }

  &.disabled {
    .icon path,
    .dropdown-icon path {
      fill: ${COLOR_NEUTRO_500};
    }

    input:disabled,
    textarea:disabled,
    select:disabled {
      border: 1px solid ${COLOR_NEUTRO_300};
      color: ${COLOR_NEUTRO_600};

      & + label {
        color: ${COLOR_NEUTRO_600};
      }

      .icon path {
        color: ${COLOR_NEUTRO_500};
      }
    }
  }

  &.withicon {
    input,
    select,
    &.datepicker input {
      padding-left: ${space(6)};
    }

    label {
      left: ${space(6)};
    }

    .icon {
      height: ${space(4)};
      left: ${space(1.25)};
      position: absolute;
      top: ${space(1.35)};
      width: ${space(4)};
    }
  }

  &.textarea {
    &.taller {
      height: ${space(14)};
    }

    & .counter {
      ${BODY_XS};
      padding-left: ${space(2)};
      &.warning {
        color: #e3ae00;
      }

      &.error {
        color: ${COLOR_RED_500};
      }
    }
  }

  input,
  textarea,
  select {
    background-color: ${COLOR_NEUTRO_300};
    border: 1px solid ${COLOR_NEUTRO_400};
    color: ${COLOR_NEUTRO_700};
    border-radius: ${BORDER_RADIUS};
    padding: ${space(2.75)} ${space(6)} ${space(0.4)} ${space(2)};
    width: 100%;

    ${media.min('tablet')`
      ${BODY_SM}
    `}

    &:focus {
      outline: none;
      border: 1px solid ${COLOR_NEUTRO_700};
    }

    &.invalid {
      border-color: ${COLOR_RED_500};
    }
  }

  input,
  select {
    height: ${space(6.5)};
  }

  textarea {
    height: 100%;
    overflow-y: auto;
    padding-top: ${space(3.75)};
    resize: none;
  }

  label {
    color: ${COLOR_NEUTRO_600};
    ${BODY_SM};
    left: ${space(2)};
    line-height: 100%;
    pointer-events: none;
    position: absolute;
    top: ${space(2.45)};
    transition: 0.1s ease-out;
  }

  input::placeholder {
    color: ${COLOR_NEUTRO_600};
  }

  &.no-label {
    input,
    textarea {
      padding: ${space(2)} ${space(2)} ${space(2)} ${space(2)};
    }
  }

  input:focus,
  input.filled,
  textarea:focus,
  textarea.filled {
    + label {
      color: ${COLOR_NEUTRO_700};
      top: ${space(1.3)};

      ${BODY_XS};
    }
  }

  select + label,
  &.datepicker label.small {
    color: ${COLOR_NEUTRO_700};
    top: ${space(1.3)};

    ${BODY_XS};
  }

  .help {
    font-size: ${rems(12)};
    margin-top: ${space(0.5)};
    padding: 0 ${space(2)};
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

    &:focus-visible + label::before {
      outline: ${COLOR_NEUTRO_700} solid 1px;
      outline-offset: -1px;
    }

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
  margin-top: ${space(-2)};
  margin-bottom: ${space(2)};
`;

const TextDivider = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-size: ${FONT_BASE_SIZE}px;
  font-weight: 200;
  width: 100%;

  p {
    margin-right: ${space(2)};
  }

  span {
    flex-grow: 1;
    position: inline-block;
    vertical-align: middle;
    height: 1px;
    width: auto;
    background-color: ${COLOR_NEUTRO_500};
  }
`;

const SwitchStyled = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  input {
    display: none;
    height: 0;
    width: 0;
    visibility: hidden;
  }

  .switch-checkbox[value='true'] + label .switch-button {
    left: calc(100% - 3px);
    transform: translateX(-100%);
  }

  .switch-checkbox[value='true'] + label {
    background-color: ${COLOR_GREEN_500};
  }

  .label-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-right: ${space(1.5)};

    label {
      margin-right: ${space(1.5)};
    }

    svg {
      transform: translateY(2px);
    }
  }

  .label-text {
    font-size: ${rems(14)};
    width: fit-content;
  }

  label {
    cursor: pointer;
  }
`;

const SwitchLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 42px;
  height: 22px;
  background: ${COLOR_NEUTRO_700};
  border-radius: 50px;
  transition: background-color 0.2s;

  .switch-button {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 25px;
    transition: 0.2s;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  }

  &:hover .switch-button {
    width: 20px;
  }
`;

const StyledIntroductionTooltip = styled.div`
  --leftPosition: 0px;

  color: ${COLOR_NEUTRO_100};
  background-color: ${COLOR_NEUTRO_700};
  height: auto;
  padding: ${space(1)} ${space(2)};
  border-radius: ${rems(4)};
  box-shadow: var(--shadow-elevation-medium);

  position: absolute;
  z-index: 10;
  text-align: center;

  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + ${space()});

  & .arrow {
    display: none;
    ${media.min('tablet')`
      display: block;
    `}
    position: absolute;
    bottom: -6px;
    left: var(--leftPosition);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #e8e8e8;
    clear: both;
    border-color: ${COLOR_NEUTRO_700} transparent transparent;
  }
`;

export {
  CheckboxStyled,
  DatePickerStyled,
  FormError,
  InputStyled,
  TextDivider,
  SwitchStyled,
  SwitchLabel,
  StyledIntroductionTooltip
};
export default FormikForm;
