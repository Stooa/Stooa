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

const devicesRepository = (): DevicesRepository => {
  const _changeInputDevice = async (device: MediaDeviceInfo): Promise<void> => {
    const kind = device.kind === 'audioinput' ? 'audio' : 'video';
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

  const _changeOutputDevice = (device: MediaDeviceInfo): Promise<void> => {
    if (!JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
      console.log('[STOOA] Adjusting audio output is not supported.');

      return Promise.resolve();
    }

    console.log('[STOOA] Audio Output Device changed ', device);

    return JitsiMeetJS.mediaDevices.setAudioOutputDevice(device.deviceId);
  };

  const changeDevice = (device: MediaDeviceInfo): Promise<void> =>
    device.kind === 'audiooutput' ? _changeOutputDevice(device) : _changeInputDevice(device);

  const loadDevices = (
    callback: (newDevices: MediaDeviceInfo[]) => void
  ): Promise<MediaDeviceInfo[]> => {
    JitsiMeetJS.mediaDevices.addEventListener(
      JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
      callback
    );

    return JitsiMeetJS.mediaDevices.enumerateDevices(callback);
  };

  const clean = (callback: (newDevices: MediaDeviceInfo[]) => void): void => {
    JitsiMeetJS.mediaDevices.removeEventListener(
      JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
      callback
    );
  };

  return {
    changeDevice,
    loadDevices,
    clean
  };
};

export default devicesRepository();
