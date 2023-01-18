import fixWebmDuration from 'webm-duration-fix';
const videoRecorderManager = () => {
  let stream: MediaStream;
  let videoStream: MediaStream;
  let audioStream: MediaStream;
  let recorder: MediaRecorder;
  let recordingData: BlobPart[];
  let totalSize = 1073741824;

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

  const mediaType = getMimeType();
  const startRecording = async audioInputDevice => {
    recordingData = [];
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const combinedStream = new MediaStream();

    const tabMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      preferCurrentTab: true
    });

    const isBrowser = tabMediaStream.getVideoTracks()[0].getSettings().displaySurface !== 'browser';

    if (isBrowser) {
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

    const audioInTab = audioContext.createMediaStreamSource(tabMediaStream);
    const audioInUserInput = audioContext.createMediaStreamSource(microStream);

    audioInTab.connect(destination);
    audioInUserInput.connect(destination);

    const combinedAudios = destination.stream.getAudioTracks()[0];

    combinedStream.addTrack(tabMediaStream.getVideoTracks()[0]);
    combinedStream.addTrack(combinedAudios);

    stream = combinedStream;
    videoStream = tabMediaStream;
    audioStream = microStream;

    if (combinedStream) {
      recorder = new MediaRecorder(combinedStream, {
        mimeType: mediaType,
        videoBitsPerSecond: 2500000
      });

      recorder.addEventListener('dataavailable', e => {
        if (e.data && e.data.size > 0) {
          recordingData.push(e.data);
          totalSize -= e.data.size;
          if (totalSize <= 0) {
            stopRecording();
          }
        }
      });

      recorder.start(5000);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      recorder = undefined;
      stopStreamTracks();
      setTimeout(() => saveRecording(), 1000);
    }
  };

  const stopStreamTracks = () => {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
    videoStream.getTracks().forEach(function (track) {
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
  };
  const saveRecording = async () => {
    const blob = await fixWebmDuration(new Blob(recordingData, { type: mediaType }));
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

export default videoRecorderManager();
