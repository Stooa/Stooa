/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DevicesRepository } from '@/types/devices';
import conferenceRepository from '@/jitsi/Conference';
import localTracksRepository from '@/jitsi/LocalTracks';
import { MediaType } from 'lib-jitsi-meet/types/hand-crafted/service/RTC/MediaType';
import { VideoType } from 'lib-jitsi-meet/types/hand-crafted/service/RTC/VideoType';

const devicesRepository = (): DevicesRepository => {
  const _changeInputDevice = async (device: MediaDeviceInfo): Promise<void> => {
    const kind = device.kind === 'audioinput' ? MediaType.AUDIO : MediaType.VIDEO;
    const oldTrack =
      kind === 'audio'
        ? conferenceRepository.getLocalAudioTrack()
        : conferenceRepository.getLocalVideoTrack();

    if (oldTrack !== undefined) {
      oldTrack.getTrack().stop();
    }

    const newTracks = await localTracksRepository.createLocalTrack(kind, device.deviceId);

    if (newTracks.length !== 1) {
      Promise.reject('More than one track to replace');
    }

    console.log('[STOOA] Device changed', device);

    conferenceRepository.addTrack(newTracks[0], oldTrack);
  };

  const _changeOutputDevice = (device: MediaDeviceInfo): Promise<unknown> => {
    if (!JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
      console.log('[STOOA] Adjusting audio output is not supported.');

      return Promise.resolve();
    }

    console.log('[STOOA] Audio Output Device changed ', device);

    return JitsiMeetJS.mediaDevices.setAudioOutputDevice(device.deviceId);
  };

  const changeDevice = (device: MediaDeviceInfo): Promise<unknown> =>
    device.kind === 'audiooutput' ? _changeOutputDevice(device) : _changeInputDevice(device);

  const loadDevices = (callback: (devices: MediaDeviceInfo[]) => void): void => {
    JitsiMeetJS.mediaDevices.addEventListener(
      JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
      callback
    );

    JitsiMeetJS.mediaDevices.enumerateDevices(callback);
  };

  const clean = (callback: (newDevices: MediaDeviceInfo[]) => void): void => {
    JitsiMeetJS.mediaDevices.removeEventListener(
      JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
      callback
    );
  };

  const isDevicePermissionGranted = (type: 'audio' | 'video'): Promise<boolean> => {
    return JitsiMeetJS.mediaDevices.isDevicePermissionGranted(type);
  };

  const screenShare = async (): Promise<boolean> => {
    const newTracks = await localTracksRepository.createLocalTrack(VideoType.DESKTOP);

    if (!newTracks) {
      await Promise.reject('User canceled desktop track creation');
    }

    const desktopTrack = newTracks.filter(track => track.getVideoType() === 'desktop');

    conferenceRepository.addTrack(desktopTrack[0], undefined);
    conferenceRepository.startScreenShareEvent();

    return Promise.resolve(true);
  };

  return {
    changeDevice,
    loadDevices,
    isDevicePermissionGranted,
    clean,
    screenShare
  };
};

export default devicesRepository();
