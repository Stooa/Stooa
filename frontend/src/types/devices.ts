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
  audioOutputDevice: MediaDeviceInfo | null;
  audioInputDevice: MediaDeviceInfo | null;
  videoDevice: MediaDeviceInfo | null;
  devices: Devices;
  permissions: { audio: boolean; video: boolean };
  showModalPermissions: boolean;
  setShowModalPermissions: Dispatch<SetStateAction<boolean>>;
}

export interface DevicesRepository {
  changeDevice: (device: MediaDeviceInfo) => Promise<unknown>;
  loadDevices: (callback: (newDevices: MediaDeviceInfo[]) => void) => void;
  clean: (callback: (newDevices: MediaDeviceInfo[]) => void) => void;
  isDevicePermissionGranted: (type: 'audio' | 'video') => Promise<boolean>;
  screenShare: () => Promise<boolean>;
}
