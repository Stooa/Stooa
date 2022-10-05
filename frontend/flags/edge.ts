/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createGetEdgeFlags } from '@happykit/flags/edge';
import { type AppFlags, config } from './config';

export const getEdgeFlags = createGetEdgeFlags<AppFlags>(config);
