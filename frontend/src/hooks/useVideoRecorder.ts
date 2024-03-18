/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import fixWebmDuration from 'webm-duration-fix';
import useEventListener from '@/hooks/useEventListener';
import { MODERATOR_LEFT, RECORDING_START, RECORDING_STOP, TRACK_ADDED } from '@/jitsi/Events';
import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';
import { MediaType } from '@/types/jitsi/media';
import { toast } from 'react-toastify';
import { pushEventDataLayer } from '@/lib/analytics';
import { supportsCaptureHandle } from '@/lib/helpers';
import { useTracks, useLocalTracks, useConference } from '@/jitsi';

const GIGABYTE = 1073741824;

const getFilename = (fileName: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const timestamp = `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}-${
    hour < 10 ? '0' + hour : hour
  }${minutes < 10 ? '0' + minutes : minutes}`;

  fileName = fileName.replace(/(?<!-)\s+(?!-)/g, '_');
  return `${fileName}_${timestamp}`;
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

const useVideoRecorder = (
  fileName: string,
  downloadingMessage: string,
  closeToGigaMessage: string,
  slug: string
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [tabMediaStream, setTabMediaStream] = useState<MediaStream>();
  const [ranNotification, setRanNotification] = useState(false);
  const { getParticipantsIds, stopRecordingEvent } = useConference();
  const { getAudioTracks } = useTracks();
  const { createLocalTrack } = useLocalTracks();

  const recorderRef = useRef<MediaRecorder>();
  const recordingData = useRef<BlobPart[]>([]);
  const totalSize = useRef<number>(GIGABYTE);
  const audioContext = useRef<AudioContext>();
  const audioDestination = useRef<MediaStreamAudioDestinationNode>();

  const recordingStart = useRef<Date>();

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

    if (stream.getAudioTracks().length > 0 && audioDestination.current && audioContext.current) {
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
    recordingStart.current = new Date();

    if (supportsCaptureHandle()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      stopStreamTracks(tabMediaStream);
      return { status: 'error', type: 'wrong-tab' };
    }

    audioContext.current = new AudioContext();
    audioDestination.current = audioContext.current.createMediaStreamDestination();

    const audioTracks = getAudioTracks(getParticipantsIds());

    if (audioTracks.length > 0) {
      audioTracks.forEach((track: JitsiTrack) => {
        if (track.getType() === 'audio') {
          _addAudioTrackToLocalRecording(track);
        }
      });
    } else {
      const audioLocalTrack = await createLocalTrack(MediaType.AUDIO);
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

      recorderRef.current.addEventListener('dataavailable', dataAvailable);

      tabMediaStream.addEventListener('inactive', () => {
        stopRecordingEvent();
        setIsRecording(false);
        stopRecording().catch(() => null);
      });

      recorderRef.current.start(5000);

      setIsRecording(true);

      pushEventDataLayer({
        category: 'Recording',
        action: 'Start',
        label: slug
      });

      return { status: 'success' };
    }

    return { status: 'error', type: 'no-combined-stream' };
  };

  const _saveRecording = useCallback(async () => {
    const mediaType = getMimeType();
    const blob = await fixWebmDuration(new Blob(recordingData.current, { type: mediaType }));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const extension = mediaType.slice(mediaType.indexOf('/') + 1, mediaType.indexOf(';'));

    a.style.display = 'none';
    a.href = url;
    a.download = `${getFilename(fileName)}.${extension}`;
    a.click();

    toast(downloadingMessage, {
      icon: '📥',
      type: 'success',
      position: 'bottom-center',
      autoClose: 3000
    });
  }, [fileName, downloadingMessage]);

  const stopRecording = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (recorderRef.current) {
        recorderRef.current.stop();
        recorderRef.current = undefined;

        stopStreamTracks(stream);
        stopStreamTracks(tabMediaStream);

        if (recordingStart.current) {
          const diff = (new Date().getTime() - recordingStart.current.getTime()) / 1000;
          pushEventDataLayer({
            category: 'Recording',
            action: 'Duration',
            label: diff.toString()
          });

          recordingStart.current = undefined;
        }

        pushEventDataLayer({
          category: 'Recording',
          action: 'Stop',
          label: slug
        });

        setTimeout(async () => {
          await _saveRecording();
          resolve(true);
        }, 1000);
      } else {
        reject(false);
      }
    });
  }, [stream, tabMediaStream, slug, _saveRecording]);

  const dataAvailable = useCallback(
    (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        recordingData.current.push(e.data);
        totalSize.current -= e.data.size;

        if (totalSize.current <= 100000000 && !ranNotification) {
          toast(closeToGigaMessage, {
            icon: '⚠️',
            toastId: 'close-to-giga',
            type: 'warning',
            position: 'bottom-center',
            autoClose: 5000
          });

          setRanNotification(true);
        }
        if (totalSize.current <= 0) {
          stopRecording().catch(() => null);
        }
      }
    },
    [ranNotification, stopRecording]
  );

  useEffect(() => {
    if (recorderRef?.current) {
      recorderRef.current.addEventListener('dataavailable', dataAvailable);
    }

    return () => {
      if (recorderRef?.current) {
        recorderRef.current.removeEventListener('dataavailable', dataAvailable);
      }
    };
  }, [ranNotification, dataAvailable]);

  useEventListener(RECORDING_START, () => {
    setIsRecording(true);
  });

  useEventListener(RECORDING_STOP, () => {
    setIsRecording(false);
  });

  useEventListener(MODERATOR_LEFT, () => {
    stopRecordingEvent();
  });

  return {
    isRecording,
    startRecording,
    stopRecording,
    setIsRecording
  };
};

export default useVideoRecorder;
