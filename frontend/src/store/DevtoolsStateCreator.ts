/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StateCreator } from 'zustand';

export type DevtoolsStateCreator<T, K> = StateCreator<
  T,
  [['zustand/devtools', never], never],
  [],
  K
>;
