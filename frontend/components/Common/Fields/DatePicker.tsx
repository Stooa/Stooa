/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { FieldAttributes, useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';

import { DatePickerStyled } from 'ui/Form';
import { ValidationError } from 'ui/Validation';
import Icon from 'components/Common/Fields/Icon';

export type IInputProps = {
  label: string;
  variant?: 'default' | 'sm';
  icon?: 'calendar' | 'clock' | 'hourglass' | 'lock' | 'mail' | 'world';
  minDate?: Date;
  placeholderText: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  dateFormat?: string;
} & FieldAttributes<Record<string, unknown>>;

const Input: React.FC<IInputProps> = ({ label, variant = 'default', icon, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const isInvalid = meta.touched && meta.error;

  return (
    <DatePickerStyled
      className={`${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''} datepicker`}
    >
      {icon && <Icon variant={icon} className="icon" />}
      <DatePicker
        {...field}
        {...props}
        selected={field.value || null}
        onChange={val => setFieldValue(field.name, val)}
        className={isInvalid ? 'invalid' : ''}
      />
      <label className="small" htmlFor={props.id || props.name}>
        {label}
      </label>
      <Icon variant="chevron-down" className="dropdown-icon" />
      {isInvalid && <ValidationError>{meta.error}</ValidationError>}
    </DatePickerStyled>
  );
};

export default Input;
