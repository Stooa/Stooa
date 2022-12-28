import React, { useEffect, useRef } from 'react';
import 'webrtc-adapter';
import RecordRTC, {RecordRTCPromisesHandler, invokeSaveAsDialog} from 'recordrtc';

export const VideoRecorder = () => {
  const foo = async () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(async function(stream) {
      let recorder = RecordRTC(stream, {
        type: 'video'
      });
      recorder.startRecording();

      const sleep = m => new Promise(r => setTimeout(r, m));
      await sleep(3000);

      recorder.stopRecording(function() {
        let blob = recorder.getBlob();
        invokeSaveAsDialog(blob);
      });
    });
  }

  return (
    <div>
      <button onClick={foo}>Record</button>
    </div>
  );
};

export default VideoRecorder;
