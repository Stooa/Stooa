import React, { useEffect, useRef, useState } from 'react';
import 'webrtc-adapter';
import RecordRTC, { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const videoSource = () =>
    navigator.mediaDevices.getDisplayMedia({
      video: true
    });

  const audioSource = () => navigator.mediaDevices.getUserMedia({ audio: true });

  const handleRecording = async () => {
    videoSource().then(vid => {
      audioSource()
        .then(audio => {
          const combinedStream = new MediaStream();
          const vidTrack = vid.getVideoTracks()[0];
          const audioTrack = audio.getAudioTracks()[0];

          combinedStream.addTrack(vidTrack);
          combinedStream.addTrack(audioTrack);
          return combinedStream;
        })
        .then(mediaStream => {
          const track = mediaStream.getVideoTracks()[0];
          track.onended = () => {
            handleStop();
          };

          setStream(mediaStream);

          recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
          recorderRef.current.startRecording();
        });
    });
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      setBlob(blob);
      invokeSaveAsDialog(blob);
      stopTracks();
    });
  };

  const stopTracks = () => {
    const tracks = stream.getVideoTracks();
    tracks[0].stop();
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  const upLoadFile = blob => {
    const fileName = getFileName('webm');

    const fileObject = new File([blob], fileName, {
      type: 'video/webm'
    });

    const formData = new FormData();
    formData.append('video-filename', blob.name);
    formData.append('video-blob', blob);
    //Send to endpoint
  };

  function getFileName(fileExtension) {
    return 'RecordRTC-' + new Date() + '.' + fileExtension;
  }

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
