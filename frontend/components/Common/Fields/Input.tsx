/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Field, FieldAttributes, useField } from 'formik';

import { InputStyled } from 'ui/Form';
import { ValidationError, ValidationIcon } from 'ui/Validation';
import Icon from 'components/Common/Fields/Icon';

export type IInputProps = {
  label: string;
  variant?: 'default' | 'sm';
  help?: string;
  icon?: 'calendar' | 'clock' | 'hourglass' | 'lock' | 'mail' | 'world';
  as?: 'input' | 'select' | 'textarea';
  validation?: boolean;
  autocomplete?: string;
} & FieldAttributes<Record<string, unknown>>;

const Input: React.FC<IInputProps> = ({
  className = '',
  label,
  variant = 'default',
  help,
  icon,
  as = 'input',
  validation = true,
  autocomplete = '',
  ...props
}) => {
  const [field, meta] = useField(props);
  const isFilled = meta.value ? meta.value.toString().trim().length !== 0 : false;
  const isValid = validation && meta.touched && !meta.error;
  const isInvalid = validation && meta.touched && meta.error;

  return (
    <InputStyled
      className={`${className} ${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''}`}>
      {icon && <Icon variant={icon} className="icon" />}
      <Field
        {...field}
        {...props}
        as={as}
        className={`${isFilled ? 'filled' : ''} ${isInvalid ? 'invalid' : ''}`}
      />
      <label htmlFor={props.id || props.name}>{label}</label>
      {isValid && (
        <ValidationIcon>
          <Icon variant="checkmark" />
        </ValidationIcon>
      )}
      {isInvalid && (
        <>
          <ValidationIcon>
            <Icon variant="cross" />
          </ValidationIcon>
          <ValidationError>{meta.error}</ValidationError>
        </>
      )}
      {help && <p className="help text-sm">{help}</p>}
    </InputStyled>
  );
};

export default Input;
