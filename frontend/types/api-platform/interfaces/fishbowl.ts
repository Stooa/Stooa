/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface Fishbowl {
  "@id"?: string;
  name: string;
  description?: string;
  startDateTime: Date;
  timezone: string;
  locale: string;
  duration: Date;
  readonly slug?: string;
  readonly host?: string;
  readonly currentStatus?: string;
  readonly participants?: string[];
  readonly startDateTimeTz?: Date;
  readonly endDateTimeTz?: Date;
  readonly durationFormatted?: string;
}
