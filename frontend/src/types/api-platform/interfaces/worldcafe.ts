/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Question} from "@/types/api-platform/interfaces/question";

export interface WorldCafe {
  "@id"?: string;
  roundMinutes?: number;
  currentRound?: number;
  hasExtraRoundTime?: boolean;
  questions?: Question[];
  name?: string;
  description?: string;
  slug: string;
  startDateTime: Date;
  timezone: string;
  locale: string;
  currentStatus?: string;
  readonly startDateTimeTz?: Date;
}
