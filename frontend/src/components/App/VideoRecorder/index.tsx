import React, { useEffect, useRef, useState } from 'react';
import 'webrtc-adapter';
import RecordRTC, { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc';
import html2canvas from 'html2canvas';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    const cameraStream = await navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(mediaStream => {
        const track = mediaStream.getVideoTracks()[0];
        track.onended = () => {
          handleStop();
        };

        setStream(mediaStream);

        recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
        recorderRef.current.startRecording();
      });
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
      <button onClick={handleRecording}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleSave}>Save</button>
      {blob && (
        <video
          src={URL.createObjectURL(blob)}
          controls
          autoPlay
          ref={refVideo}
          style={{ width: '700px', margin: '1em', zIndex: 99999 }}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
