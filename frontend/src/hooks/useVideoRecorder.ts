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
import localTracksRepository from '@/jitsi/LocalTracks';
import { MediaType } from '@/types/jitsi/media';
import { useStooa } from '@/contexts/StooaManager';

const GIGABYTE = 1073741824;

const getFilename = () => {
  const now = new Date();
  const timestamp = now.toISOString();
  return `recording_${timestamp}`;
};

const stopStreamTracks = (stream: MediaStream | undefined): void => {
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
  const recorderRef = useRef<MediaRecorder>();
  const recordingData = useRef<BlobPart[]>([]);
  const totalSize = useRef<number>(GIGABYTE);
  const audioContext = useRef<AudioContext>(new AudioContext());
  const audioDestination = useRef<MediaStreamAudioDestinationNode>(
    audioContext.current.createMediaStreamDestination()
  );
  const { setIsRecording } = useStooa();

  const _supportsCaptureHandle = (): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return navigator.mediaDevices.setCaptureHandleConfig;
  };
  const _checkIsCurrentTab = (tabMediaStream: MediaStream): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return tabMediaStream.getVideoTracks()[0].getCaptureHandle()?.handle !== 'Stooa';
  };

  const _isBrowser = (tabMediaStream: MediaStream): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return tabMediaStream.getVideoTracks()[0].getSettings().displaySurface !== 'browser';
  };

  const _addAudioTrackToLocalRecording = (track: JitsiTrack): void => {
    const stream = new MediaStream([track.getTrack()]);

    if (stream.getAudioTracks().length > 0 && audioDestination.current) {
      audioContext.current.createMediaStreamSource(stream).connect(audioDestination.current);
    }
  };

  useEventListener(TRACK_ADDED, ({ detail: { track } }) => {
    if (!track && track.mediaType !== MediaType.AUDIO) return;

    _addAudioTrackToLocalRecording(track);
  });

  const startRecording = async (): Promise<{
    status: 'success' | 'error';
    type?: 'wrong-tab' | 'no-combined-stream';
  }> => {
    recordingData.current = [];
    totalSize.current = GIGABYTE;

    if (_supportsCaptureHandle()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      navigator.mediaDevices.setCaptureHandleConfig({
        handle: 'Stooa',
        permittedOrigins: ['*']
      });
    }

    const currentTitle = document.title;

    document.title = document.title + '(Select this tab)';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      preferCurrentTab: true
    });

    document.title = currentTitle;

    if (_isBrowser(tabMediaStream) || _checkIsCurrentTab(tabMediaStream)) {
      stopStreamTracks(tabMediaStream);
      return { status: 'error', type: 'wrong-tab' };
    }

    audioContext.current = new AudioContext();
    audioDestination.current = audioContext.current.createMediaStreamDestination();

    const audioTracks = trackRepository.getAudioTracks();

    if (audioTracks.length > 0) {
      trackRepository.getAudioTracks().forEach((track: JitsiTrack) => {
        if (track.getType() === 'audio') {
          _addAudioTrackToLocalRecording(track);
        }
      });
    } else {
      const audioLocalTrack = await localTracksRepository.createLocalTrack(MediaType.AUDIO);
      await audioLocalTrack[0].mute();
      _addAudioTrackToLocalRecording(audioLocalTrack[0]);
    }

    const combinedStream = new MediaStream([
      ...(audioDestination.current.stream.getAudioTracks() || []),
      tabMediaStream.getVideoTracks()[0]
    ]);

    setStream(combinedStream);
    setTabMediaStream(tabMediaStream);

    if (combinedStream) {
      recorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: getMimeType(),
        videoBitsPerSecond: 2500000
      });

      recorderRef.current.addEventListener('dataavailable', e => {
        if (e.data && e.data.size > 0) {
          recordingData.current.push(e.data);
          totalSize.current -= e.data.size;
          if (totalSize.current <= 0) {
            stopRecording();
          }
        }
      });

      tabMediaStream.addEventListener('inactive', () => {
        stopRecording();
      });

      recorderRef.current.start(5000);
      return { status: 'success' };
    }
    return { status: 'error', type: 'no-combined-stream' };
  };

  const stopRecording = (): boolean => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = undefined;

      stopStreamTracks(stream);
      stopStreamTracks(tabMediaStream);

      setTimeout(() => _saveRecording(), 1000);
      return true;
    }
    return false;
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

    setIsRecording(false);
  };

  return {
    startRecording,
    stopRecording
  };
};

export default useVideoRecorder;
