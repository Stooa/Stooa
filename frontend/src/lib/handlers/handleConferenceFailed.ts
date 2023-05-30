/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CONFERENCE_PASSWORD_REQUIRED } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';

export const handleConferenceFailed = error => {
  if (error === 'conference.authenticationRequired') {
    dispatchEvent(CONFERENCE_PASSWORD_REQUIRED);
  }
};
