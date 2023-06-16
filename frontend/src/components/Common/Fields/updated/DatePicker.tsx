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
  minDate?: Date | undefined;
  placeholderText: string;
  showTimeSelect?: boolean | undefined;
  showTimeSelectOnly?: boolean | undefined;
  timeIntervals?: number | undefined;
  dateFormat?: string | undefined;
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
  ...props
}: DatePicker) => {
  // const { setFieldValue } = useFormikContext();
  // const [field, meta] = useField(props);
  const isInvalid = hasError || !isValid;

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
            dateFormat="dd/MM/yyyy"
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
