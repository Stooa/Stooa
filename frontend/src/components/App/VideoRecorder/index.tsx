import React, { useEffect, useRef, useState } from 'react';
import 'webrtc-adapter';
import RecordRTC, {RecordRTCPromisesHandler, invokeSaveAsDialog} from 'recordrtc';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {

    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(cameraStream);
    recorderRef.current = new RecordRTC(cameraStream, { type: 'video' });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);


  return (
    <div>
      <button onClick={handleRecording}>Start   </button>
      <button onClick={handleStop}>Stop  </button>
      <button onClick={handleSave}>Save  </button>
    </div>
  );
};

export default VideoRecorder;
