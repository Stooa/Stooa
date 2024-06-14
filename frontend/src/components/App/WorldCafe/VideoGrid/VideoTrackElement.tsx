/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';
import { useEffect, useRef } from 'react';
import { StyledVideoElement } from './styles';

interface Props {
  videoTrack: JitsiTrack;
}

export const VideoTrackElement = ({ videoTrack }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoTrack.attach(videoRef.current);
    }
    return () => {
      if (videoRef.current && videoTrack) {
        videoTrack.detach(videoRef.current);
      }
    };
  }, []);

  return (
    <StyledVideoElement
      className={`${videoTrack.isLocal() ? 'is-local' : ''}`}
      ref={videoRef}
      autoPlay={!videoTrack.isLocalAudioTrack()}
      muted
      playsInline
    />
  );
};
