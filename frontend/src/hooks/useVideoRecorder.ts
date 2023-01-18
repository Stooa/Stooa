/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useState } from 'react';
import fixWebmDuration from 'webm-duration-fix';

const GIGABYTE = 1073741824;
const getMimeType = (): string => {
  const possibleTypes = [
    'video/mp4;codecs=h264',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8'
  ];

  for (const type of possibleTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  throw new Error('No MIME Type supported by MediaRecorder');
};

const useVideoRecorder = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [tabMediaStream, setTabMediaStream] = useState<MediaStream>();
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const recorderRef = useRef<MediaRecorder>();
  const recordingData = useRef<BlobPart[]>([]);
  const [totalSize, setTotalSize] = useState<number>(GIGABYTE);

  const startRecording = async audioInputDevice => {
    recordingData.current = [];

    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const combinedStream = new MediaStream();

    // @ts-ignore
    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      // @ts-ignore
      preferCurrentTab: true
    });

    // @ts-ignore
    const isBrowser = tabMediaStream.getVideoTracks()[0].getSettings()?.displaySurface !== 'browser';

    if (isBrowser) {
      tabMediaStream.getTracks().forEach(function (track: MediaStreamTrack) {
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
        mimeType: getMimeType(),
        videoBitsPerSecond: 2500000
      });

      recorderRef.current.addEventListener('dataavailable', e => {
        if (e.data && e.data.size > 0) {
          recordingData.current.push(e.data);
          setTotalSize(totalSize - e.data.size);
          if (totalSize <= 0) {
            stopRecording();
          }
        }
      });

      recorderRef.current.start(5000);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = undefined;
      stopStreamTracks();
      setTimeout(() => _saveRecording(), 1000);
    }
  };

  const _stopStreamTrack = (stream: MediaStream|undefined): void => {
    if (stream) {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }
  const stopStreamTracks = () => {
    _stopStreamTrack(stream);
    _stopStreamTrack(tabMediaStream);
    _stopStreamTrack(audioStream);
  };

  const _getFilename = () => {
    const now = new Date();
    const timestamp = now.toISOString();
    return `recording_${timestamp}`;
  };

  const _saveRecording = async () => {
    const mediaType = getMimeType();
    const blob = await fixWebmDuration(new Blob(recordingData.current, { type: mediaType }));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const extension = mediaType.slice(mediaType.indexOf('/') + 1, mediaType.indexOf(';'));

    a.style.display = 'none';
    a.href = url;
    a.download = `${_getFilename()}.${extension}`;
    a.click();
  };

  return {
    startRecording,
    stopRecording
  };
};

export default useVideoRecorder;
