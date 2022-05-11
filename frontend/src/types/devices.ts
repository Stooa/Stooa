/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Dispatch, SetStateAction } from 'react';

export interface Devices {
  audioOutputDevices: MediaDeviceInfo[];
  audioInputDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
}

export interface DevicesCtx {
  selectAudioOutputDevice: (deviceId: string) => void;
  selectAudioInputDevice: (deviceId: string) => void;
  selectVideoDevice: (deviceId: string) => void;
  setDevices: Dispatch<SetStateAction<Devices>>;
  audioOutputDevice: MediaDeviceInfo;
  audioInputDevice: MediaDeviceInfo;
  videoDevice: MediaDeviceInfo;
  devices: Devices;
  permissions: { audio: boolean; video: boolean };
}

export interface DevicesRepository {
  changeDevice: (device: MediaDeviceInfo) => Promise<void>;
  loadDevices: (callback: (newDevices: MediaDeviceInfo[]) => void) => void;
  clean: (callback: (newDevices: MediaDeviceInfo[]) => void) => void;
  isDevicePermissionGranted: (type?: 'video' | 'audio') => Promise<boolean>;
}
