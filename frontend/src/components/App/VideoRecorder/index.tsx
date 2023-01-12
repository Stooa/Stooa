/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState } from 'react';
import 'webrtc-adapter';
import RecordRTC, { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const videoSource = () =>
    navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

  const audioSource = () => navigator.mediaDevices.getUserMedia({ audio: true });

  const handleRecording = async () => {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const combinedStream = new MediaStream();

    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    const audioTrack = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: 'default'
      }
    });

    const audioIn_01 = audioContext.createMediaStreamSource(tabMediaStream);
    const audioIn_02 = audioContext.createMediaStreamSource(audioTrack);

    audioIn_01.connect(destination);
    audioIn_02.connect(destination);

    console.log('SAURIKI KLK', destination.stream.getAudioTracks());

    const combinedAudios = destination.stream.getAudioTracks()[0];

    combinedStream.addTrack(tabMediaStream.getVideoTracks()[0]);
    combinedStream.addTrack(combinedAudios);

    setStream(combinedStream);
    recorderRef.current = new RecordRTC(combinedStream, { type: 'video' });
    recorderRef.current.startRecording();
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
      {/* {blob && (
        <video
          src={URL.createObjectURL(blob)}
          controls
          autoPlay
          ref={refVideo}
          style={{ width: '700px', margin: '1em', zIndex: 99999 }}
        />
      )} */}
    </div>
  );
};

export default VideoRecorder;
