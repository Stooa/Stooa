/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DatePickerField from 'react-datepicker';

import { DatePickerStyled } from '@/ui/Form';
import { ValidationError } from '@/ui/Validation';
import Icon, { IconVariant } from '@/components/Common/Fields/Icon';
import { Controller, FieldError } from 'react-hook-form';
import DatePicker from 'react-datepicker';

type DatePicker = Omit<JSX.IntrinsicElements['input'], 'as' | 'type' | 'ref'> & {
  icon?: IconVariant;
  variant?: 'default' | 'small';
  label?: string;
  hasError?: FieldError;
  isValid?: boolean;
  minDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  placeholderText: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  dateFormat?: 'dd/MM/yyyy' | 'HH:mm';
  control: any;
  name: string;
};

const DatePicker = ({
  label,
  variant = 'default',
  icon,
  hasError,
  isValid = true,
  control,
  name,
  dateFormat = 'dd/MM/yyyy',
  timeIntervals = 15,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  ...props
}: DatePicker) => {
  const isInvalid = hasError || !isValid;
  console.log(hasError);

  return (
    <DatePickerStyled
      className={`${variant !== 'default' ? variant : ''} ${icon ? 'withicon' : ''} datepicker`}
    >
      {icon && <Icon variant={icon} className="icon" />}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePickerField
            {...props}
            dateFormat={dateFormat}
            timeIntervals={timeIntervals}
            timeFormat="HH:mm"
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            autocomplete="off"
            selected={field.value}
            onChange={date => field.onChange(date)}
            className={isInvalid ? 'invalid' : ''}
          />
        )}
      />

      <label className="small" htmlFor={name}>
        {label}
      </label>
      <Icon variant="chevron-down" className="dropdown-icon" />
      {hasError && <ValidationError>{hasError.message}</ValidationError>}
    </DatePickerStyled>
  );
};

export default DatePicker;
