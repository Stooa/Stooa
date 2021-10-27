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
import { ValidationError } from 'ui/Validation';
import Icon from 'components/Common/Fields/Icon';

export type IInputProps = {
  label: string;
  variant?: 'default' | 'sm';
  help?: string;
  icon?: 'calendar' | 'clock' | 'hourglass' | 'lock' | 'mail' | 'world' | 'language';
  validation?: boolean;
} & FieldAttributes<Record<string, unknown>>;

const Input: React.FC<IInputProps> = ({
  label,
  variant = 'default',
  help,
  icon,
  validation = true,
  ...props
}) => {
  const [field, meta] = useField(props);
  const isFilled = meta.value.toString().trim().length !== 0;
  const isInvalid = validation && meta.touched && meta.error;

  return (
    <InputStyled className={`${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''}`}>
      {icon && <Icon variant={icon} className="icon" />}
      <Field
        {...field}
        {...props}
        as="select"
        className={`${isFilled ? 'filled' : ''} ${isInvalid ? 'invalid' : ''}`}
      />
      <label htmlFor={props.id || props.name}>{label}</label>
      <Icon variant="chevron-down" className="dropdown-icon" />
      {isInvalid && <ValidationError>{meta.error}</ValidationError>}
      {help && <p className="help text-sm">{help}</p>}
    </InputStyled>
  );
};

export default Input;
