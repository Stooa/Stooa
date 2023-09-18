/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FieldValues } from 'react-hook-form';

type Question = {
  title: string;
  description: string;
};

interface FormValues {
  title: string;
  description: string;
  date: Date;
  time: Date;
  timezone: string;
  language: string;
  roundDuration: number;
  addExtraTime: boolean;
  questions: Question[];
}

export type WorldCafeFormValues = FormValues & FieldValues;
