/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePickerField from 'react-datepicker';

import { DatePicker } from '@/types/input';
import { DatePickerStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import Icon from '@/components/Common/Fields/Icon';

const Input: React.FC<DatePicker> = ({ label, variant = 'default', icon, selected, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const isInvalid = meta.touched && meta.error;
  const selectedValue = field.value ? field.value : selected;

  return (
    <DatePickerStyled
      className={`${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''} datepicker`}>
      {icon && <Icon variant={icon} className="icon" />}
      <DatePickerField
        {...props}
        selected={selectedValue}
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
