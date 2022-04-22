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
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_PURPLE_500,
  COLOR_RED_500,
  FONT_BASE_SIZE
} from '@/ui/settings';
import { BODY_SM, BODY_XS } from '@/ui/Texts';

interface Props {
  $isFull?: boolean;
}

const FormikForm = styled(Form)`
  position: relative;
  margin-top: ${space(4)};
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
      padding-bottom: ${space(2)};
      margin-bottom: 0;

      span {
        position: absolute;
        width: 100%;
        text-align: center;
        color: ${COLOR_GREEN_600};
        margin: 0;

        &.success-message-bottom {
          bottom: -1.5ch;
        }

        &.success-message-top {
          top: -3.2ch;
        }
      }
    }

    > *:not(:last-child) {
      margin-bottom: ${space(2)};
    }
    > .textarea {
      margin-bottom: ${space(4)};
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

    a {
      color: ${COLOR_PURPLE_500};
    }
  }

  a {
    /* text-decoration: underline; */
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
    color: ${COLOR_NEUTRO_600};
  }

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
    transition: 0.1s ease-out;
  }

  input::placeholder {
    color: ${COLOR_NEUTRO_700};
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
  display: flex;
  align-items: center;
  width: 100%;

  > *:not(:nth-child(2)) {
    margin-left: ${space()};
  }

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

  .icon-wrapper {
    padding: ${space(1)};
  }

  .label-text {
    font-size: ${rems(14)};
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
  margin-right: ${space()};
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
  bottom: 150px;

  /* ${media.min('tablet')`
    bottom: 150%;
    width: 60ch;
  `} */

  &:after {
    ${media.min('tablet')`
    content: '';
    `}
    position: absolute;
    right: 0;
    bottom: -10px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #e8e8e8;
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
