/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dispatchEvent } from '@/lib/helpers';
import { JITSI_CONNECTION_ESTABLISHED } from '@/hooks/useJitsi';

export const handleConnectionEstablished = async () => {
  dispatchEvent(JITSI_CONNECTION_ESTABLISHED);
};
