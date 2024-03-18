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

interface Props {
  audioTrack: JitsiTrack;
}

export const AudioTrackElement = ({ audioTrack }: Props) => {
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioTrack.attach(audioRef.current);
    }
    return () => {
      if (audioRef.current && audioTrack) {
        audioTrack.detach(audioRef.current);
      }
    };
  }, []);

  return (
    <audio
      className={`${audioTrack.isLocal() ? 'is-local' : ''}`}
      ref={audioRef}
      autoPlay={!audioTrack.isLocalAudioTrack()}
    />
  );
};
