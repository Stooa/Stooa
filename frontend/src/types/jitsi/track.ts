/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type MediaType = 'audio' | 'video' | 'presenter' | 'screenshare';

export interface Track {
  isReceivingData: boolean;
  jitsiTrack: Record<string, unknown>;
  lastMediaEvent?: string;
  local: boolean;
  mediaType: MediaType;
  mirror: boolean;
  muted: boolean;
  noDataFromSourceNotificationInfo?: {
    timeout?: number;
    uid?: string;
  };
  participantId: string;
  streamingStatus?: string;
  videoStarted: boolean;
  videoType?: string | null;
}
