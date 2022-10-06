/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Configuration } from '@happykit/flags/config';

// You can replace this with your exact flag types
export type AppFlags = {
  cdti: boolean;
};

export const config: Configuration<AppFlags> = {
  envKey: process.env.NEXT_PUBLIC_FLAGS_ENV_KEY!,

  // You can provide defaults flag values here
  defaultFlags: {
    cdti: false
  }
};
