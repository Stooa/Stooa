/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  createUseFlags,
  type InitialFlagState as GenericInitialFlagState
} from '@happykit/flags/client';
import { createUseFlagBag } from '@happykit/flags/context';
import { type AppFlags, config } from './config';

export type InitialFlagState = GenericInitialFlagState<AppFlags>;
export const useFlags = createUseFlags<AppFlags>(config);
export const useFlagBag = createUseFlagBag<AppFlags>();
