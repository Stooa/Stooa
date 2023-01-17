/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useRef, useState } from 'react';
import 'webrtc-adapter';
import { useDevices } from '@/contexts/DevicesContext';
import fixWebmDuration from 'webm-duration-fix';

export const VideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [tabMediaStream, setTabMediaStream] = useState<MediaStream>();
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const recorderRef = useRef<MediaRecorder>();
  const { audioInputDevice } = useDevices();
  const [recordingData, setRecordingData] = useState<BlobPart[]>([]);
  const mediaType =  'video/webm;codecs=vp9';
  let totalSize = 1073741824;

  const handleRecording = async () => {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const combinedStream = new MediaStream();

    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      preferCurrentTab: true
    });

    if (tabMediaStream.getVideoTracks()[0].getSettings().displaySurface !== 'browser') {
      tabMediaStream.getTracks().forEach(function (track) {
        track.stop();
      });
      alert('Select Browser tab. Thank you');
      return false;
    }

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

    if (combinedStream) {
      recorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: mediaType,
        videoBitsPerSecond: 2500000
      });

      recorderRef.current.addEventListener('dataavailable', e => {
        if (e.data && e.data.size > 0) {
          setRecordingData([...recordingData, e.data])
          totalSize -= e.data.size;
          if (totalSize <= 0) {
            handleStop();
          }
        }
      });

      recorderRef.current.start(5000);
    }
  };

  const handleStop = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      stopStreamTracks();
      setTimeout(() => saveRecording(), 1000);
    }
  };

  const stopStreamTracks = () => {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
    tabMediaStream.getTracks().forEach(function (track) {
      track.stop();
    });
    audioStream.getTracks().forEach(function (track) {
      track.stop();
    });
  };

  const getFilename = () => {
    const now = new Date();
    const timestamp = now.toISOString();
    return `recording_${timestamp}`;
  }
  const saveRecording = async() => {
    const blob = await fixWebmDuration(new Blob([...recordingData], { type: mediaType }));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const extension = mediaType.slice(mediaType.indexOf('/') + 1, mediaType.indexOf(';'))
    a.style.display = 'none';
    a.href = url;
    a.download = `${getFilename()}.${extension}`;
    a.click();
  }

  return (
    <div>
      <button onClick={handleRecording}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default VideoRecorder;
