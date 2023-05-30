/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { REACTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';

export const handleMessageReceived = (id: string, text: string, timestamp: number) => {
  dispatchEvent(REACTION_MESSAGE_RECEIVED, { id, text, timestamp });
};
