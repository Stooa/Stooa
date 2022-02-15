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
    };
  };
}

export interface UpdateFishbowlOptions {
  variables: {
    input: {
      name?: string;
      description?: string;
      startDateTime?: string;
      timezone?: string;
      duration?: string;
      locale?: string;
      hasIntroduction?: boolean;
      isFishbowlNow?: boolean;
    };
  };
}
