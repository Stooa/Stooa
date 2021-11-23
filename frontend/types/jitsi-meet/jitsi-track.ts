/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface JitsiTrack {
  deviceId: string;
  attach: (container: HTMLAudioElement|HTMLVideoElement) => void;
  detach: (container: HTMLAudioElement|HTMLVideoElement) => void;
  dispose: () => Promise<void>;
  getId: () => string|null;
  getMSID: () => string|null;
  getOriginalStream: () => MediaStream;
  getStreamId: () => string|null;
  getTrack: () => MediaStreamTrack;
  getTrackId: () => string|null;
  getTrackLabel: () => string;
  getType: () => string;
  getUsageLabel: () => string;
  getVideoType: () => string;
  isActive: () => boolean;
  isAudioTrack: () => boolean;
  isLocal: () => boolean;
  isLocalAudioTrack: () => boolean;
  isScreenSharing: () => boolean;
  isVideoTrack: () => boolean;
  isWebRTCTrackMuted: () => boolean;
  // setAudioLevel: (audioLevel: number, tpc?: TraceablePeerConnection) => void;
  setAudioOutput: (audioOutputDeviceId: string) => Promise<void>;
}
