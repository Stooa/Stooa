/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiConnection from 'lib-jitsi-meet/types/hand-crafted/JitsiConnection';
import { handleConnectionFailed } from '@/lib/handlers';
import { handleConnectionEstablished } from './handleConnectionEstablished';

export const handleConnectionDisconnected = (connection: JitsiConnection) => {
  const {
    events: {
      connection: { CONNECTION_ESTABLISHED, CONNECTION_FAILED, CONNECTION_DISCONNECTED }
    }
  } = JitsiMeetJS;

  connection.removeEventListener(CONNECTION_ESTABLISHED, handleConnectionEstablished);
  connection.removeEventListener(CONNECTION_FAILED, handleConnectionFailed);
  connection.removeEventListener(CONNECTION_DISCONNECTED, handleConnectionDisconnected);

  console.log('[STOOA] Handle connection disconnected');
};
