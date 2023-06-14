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
  id: string;
  variant?: 'default' | 'small';
}

export const TimeZoneSelector = ({
  label,
  placeholder,
  id,
  variant = 'default',
  ...props
}: Props) => {
  const timezones = countriesAndTimezones.getAllTimezones();

  return (
    <Select
      variant={variant}
      className="select"
      label={label}
      id={id}
      icon="world"
      autoComplete="off"
      {...props}
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
