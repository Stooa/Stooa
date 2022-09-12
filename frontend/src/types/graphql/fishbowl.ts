/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CreateFishbowlOptions {
  variables: {
    input: {
      name: string;
      description: string;
      startDateTime: string;
      timezone: string;
      duration: string;
      locale: string;
      hasIntroduction: boolean;
      isFishbowlNow: boolean;
      isPrivate: boolean;
      plainPassword?: string;
    };
  };
}

export interface UpdateFishbowlOptions {
  variables: {
    input: {
      id: string;
      name?: string;
      description?: string;
      startDateTime?: string;
      timezone?: string;
      duration?: string;
      locale?: string;
      hasIntroduction?: boolean;
      isFishbowlNow?: boolean;
      isPrivate?: boolean;
      plainPassword?: string;
    };
  };
}

export interface Fishbowl {
  id: string;
  type: string;
  name: string;
  description: string;
  slug: string;
  timezone: string;
  locale: string;
  host: string;
  currentStatus: string;
  isFishbowlNow: boolean;
  hasIntroduction: boolean;
  startDateTimeTz: string;
  endDateTimeTz: string;
  durationFormatted: string;
}
