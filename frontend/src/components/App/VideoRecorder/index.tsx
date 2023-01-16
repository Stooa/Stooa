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
import { useDevices } from '@/contexts/DevicesContext';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [tabMediaStream, setTabMediaStream] = useState<MediaStream>();
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);
  const { audioInputDevice } = useDevices();

  const handleRecording = async () => {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const combinedStream = new MediaStream();

    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      preferCurrentTab: true,
      audio: true
    });

    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioInputDevice ? audioInputDevice.deviceId : 'default'
      }
    });

    const audioInTab = audioContext.createMediaStreamSource(tabMediaStream);
    const audioInUserInput = audioContext.createMediaStreamSource(audioStream);

    audioInTab.connect(destination);
    audioInUserInput.connect(destination);

    const combinedAudios = destination.stream.getAudioTracks()[0];

    combinedStream.addTrack(tabMediaStream.getVideoTracks()[0]);
    combinedStream.addTrack(combinedAudios);

    setStream(combinedStream);
    setTabMediaStream(tabMediaStream);
    setAudioStream(audioStream);

    recorderRef.current = new RecordRTC(combinedStream, { type: 'video' });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      setBlob(blob);
      stopStreamTracks();
      invokeSaveAsDialog(blob);
    });
  };

  const stopStreamTracks = () => {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    tabMediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
    audioStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

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
