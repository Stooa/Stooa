/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FieldAttributes } from 'formik';

export type Input = {
  label: string;
  variant?: 'default' | 'sm';
  help?: string;
  icon?: 'calendar' | 'clock' | 'hourglass' | 'language' | 'lock' | 'mail' | 'world';
  as?: 'input' | 'select' | 'textarea';
  validation?: boolean;
  autocomplete?: string;
} & FieldAttributes<Record<string, unknown>>;

export type DatePicker = Input & {
  minDate?: Date;
  placeholderText: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  dateFormat?: string;
};
