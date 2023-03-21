/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface Participant {
  id: string;
  name: string;
  linkedin: string;
  twitter: string;
  isModerator: boolean;
  isCurrentUser: boolean;
  guestId?: string;
  joined: boolean;
  isMuted: boolean;
  isVideoMuted: boolean;
  _connectionJid: string;
  getId: () => string;
  getDisplayName: () => string;
}
