/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import countriesAndTimezones from 'countries-and-timezones';
import Select from '../Fields/updated/Select';

interface Props {
  label: string;
  placeholder: string;
  name: string;
  register: any;
  variant?: 'default' | 'small';
  defaultValue?: string;
}

export const TimeZoneSelector = ({
  label,
  placeholder,
  variant = 'default',
  defaultValue = '',
  register,
  name
}: Props) => {
  const timezones = countriesAndTimezones.getAllTimezones();

  return (
    <Select
      icon="world"
      variant={variant}
      label={label}
      {...register(name)}
      defaultValue={defaultValue}
    >
      <option value="">{placeholder}</option>
      {Object.keys(timezones).map((zone, index) => {
        const text = `(GTM${timezones[zone].utcOffsetStr}) ${timezones[zone].name}`;
        return (
          <option key={`zone_${index}`} value={zone}>
            {text}
          </option>
        );
      })}
    </Select>
  );
};
