/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { useDevices } from '@/contexts/DevicesContext';
import useVideoRecorder from '@/hooks/useVideoRecorder';

export const VideoRecorder = () => {
  const { audioInputDevice } = useDevices();
  const { startRecording, stopRecording } = useVideoRecorder();

  return (
    <div>
      <button onClick={() => startRecording(audioInputDevice)}>Start</button>
      <button onClick={() => stopRecording()}>Stop</button>
    </div>
  );
};

export default VideoRecorder;
