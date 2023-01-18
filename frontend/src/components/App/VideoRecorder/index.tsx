/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import videoRecorderManager from '@/components/App/VideoRecorder/VideoRecorderManager';
import { useDevices } from '@/contexts/DevicesContext';
export const VideoRecorder = () => {
  const { audioInputDevice } = useDevices();

  return (
    <div>
      <button onClick={() => videoRecorderManager.startRecording(audioInputDevice)}>Start</button>
      <button onClick={() => videoRecorderManager.stopRecording()}>Stop</button>
    </div>
  );
};

export default VideoRecorder;
