/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Field, useField } from 'formik';

import { InputStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import Icon from '@/components/Common/Fields/Icon';
import { Input } from '@/types/input';

const InputField: React.FC<Input> = ({
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
    <InputStyled
      className={`select ${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''}`}
    >
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
      {help && <p className="help body-sm">{help}</p>}
    </InputStyled>
  );
};

export default InputField;
