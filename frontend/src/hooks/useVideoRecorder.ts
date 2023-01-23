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
import trackRepository from '@/jitsi/Tracks';
import useEventListener from '@/hooks/useEventListener';
import { TRACK_ADDED } from '@/jitsi/Events';
import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';

const GIGABYTE = 1073741824;

const getFilename = () => {
  const now = new Date();
  const timestamp = now.toISOString();
  return `recording_${timestamp}`;
};

const stopStreamTrack = (stream: MediaStream | undefined): void => {
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
};

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
  const [microStream, setMicroStream] = useState<MediaStream>();
  const recorderRef = useRef<MediaRecorder>();
  const recordingData = useRef<BlobPart[]>([]);
  const [totalSize, setTotalSize] = useState<number>(GIGABYTE);
  let audioDestination: MediaStreamAudioDestinationNode;
  let audioContext: AudioContext;

  const _supportsCaptureHandle = (): boolean => {
    // @ts-ignore
    return Boolean(navigator.mediaDevices.setCaptureHandleConfig);
  };
  const _checkIsCurrentTab = (tabMediaStream: MediaStream): boolean => {
    // @ts-ignore
    return tabMediaStream.getVideoTracks()[0].getCaptureHandle()?.handle !== 'Stooa';
  };

  const _isBrowser = (tabMediaStream: MediaStream): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return tabMediaStream.getVideoTracks()[0].getSettings().displaySurface !== 'browser';
  };

  const _addAudioTrackToLocalRecording = (track: MediaStreamTrack): void => {
    const stream = new MediaStream([track]);

    if (stream.getAudioTracks().length > 0 && audioDestination) {
      audioContext?.createMediaStreamSource(stream).connect(audioDestination);
    }
  };

  useEventListener(TRACK_ADDED, ({ detail: { track } }) => {
    if (!track && track.mediaType !== 'audio') return;
    const audioTrack = track.getTrack();
    _addAudioTrackToLocalRecording(audioTrack);
  });

  const startRecording = async audioInputDevice => {
    recordingData.current = [];

    if (_supportsCaptureHandle) {
      // @ts-ignore
      navigator.mediaDevices.setCaptureHandleConfig({
        handle: 'Stooa',
        permittedOrigins: ['*']
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      preferCurrentTab: true
    });

    if (_isBrowser(tabMediaStream) || _checkIsCurrentTab(tabMediaStream)) {
      tabMediaStream.getTracks().forEach(function (track: MediaStreamTrack) {
        track.stop();
      });
      alert('Select Browser tab. Thank you');
      return false;
    }

    const microStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: audioInputDevice ? audioInputDevice.deviceId : 'default'
      }
    });

    audioContext = new AudioContext();
    audioDestination = audioContext.createMediaStreamDestination();

    trackRepository.getAudioTracks().forEach((track: JitsiTrack) => {
      const audioTrack = track.getTrack();
      if (audioTrack.kind === 'audio') {
        _addAudioTrackToLocalRecording(audioTrack);
      }
    });
    audioContext.createMediaStreamSource(microStream).connect(audioDestination);
    // audioContext.createMediaStreamSource(tabMediaStream).connect(audioDestination);

    const combinedStream = new MediaStream([
      ...(audioDestination?.stream.getAudioTracks() || []),
      tabMediaStream.getVideoTracks()[0]
    ]);

    setStream(combinedStream);
    setTabMediaStream(tabMediaStream);
    setMicroStream(microStream);

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

      tabMediaStream.addEventListener('inactive', () => {
        stopRecording();
      });

      recorderRef.current.start(5000);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = undefined;

      stopStreamTrack(stream);
      stopStreamTrack(tabMediaStream);
      stopStreamTrack(microStream);

      setTimeout(() => _saveRecording(), 1000);
    }
  };

  const _saveRecording = async () => {
    const mediaType = getMimeType();
    const blob = await fixWebmDuration(new Blob(recordingData.current, { type: mediaType }));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const extension = mediaType.slice(mediaType.indexOf('/') + 1, mediaType.indexOf(';'));

    a.style.display = 'none';
    a.href = url;
    a.download = `${getFilename()}.${extension}`;
    a.click();
  };

  return {
    startRecording,
    stopRecording
  };
};

export default useVideoRecorder;
