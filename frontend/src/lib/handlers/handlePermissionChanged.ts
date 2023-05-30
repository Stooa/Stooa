/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PERMISSION_CHANGED } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';

export const handlePermissionChanged = permissions => {
  if (permissions) dispatchEvent(PERMISSION_CHANGED, permissions);

  console.log('[STOOA] Permission changed');
};
