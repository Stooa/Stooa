/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState, useEffect } from 'react';
import { Devices, DevicesCtx } from '@/types/devices';
import userRepository from '@/jitsi/User';
import devicesRepository from '@/jitsi/Devices';
import { parseDevices } from '@/lib/helpers';
import useEventListener from '@/hooks/useEventListener';
import { PERMISSION_CHANGED } from '@/jitsi/Events';
import createGenericContext from '@/contexts/createGenericContext';

const [useDevices, DevicesContextProvider] = createGenericContext<DevicesCtx>();

const DevicesProvider = ({ children }) => {
  const [devices, setDevices] = useState<Devices>({
    audioOutputDevices: [],
    audioInputDevices: [],
    videoDevices: []
  });
  const [audioOutputDevice, setAudioOutputDevice] = useState<MediaDeviceInfo | null>(
    userRepository.getUserAudioOutput()
  );
  const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo | null>(
    userRepository.getUserAudioInput()
  );
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo | null>(
    userRepository.getUserVideoInput()
  );
  const [permissions, setPermissions] = useState({
    audio: true,
    video: true
  });
  const [showModalPermissions, setShowModalPermissions] = useState<boolean>(false);

  const _getPermissions = async () => {
    return {
      audio: await devicesRepository.isDevicePermissionGranted('audio'),
      video: await devicesRepository.isDevicePermissionGranted('video')
    };
  };

  const _findDevice = (
    deviceId: string,
    newDevices: MediaDeviceInfo[]
  ): MediaDeviceInfo | undefined => {
    return newDevices.find(device => device.deviceId === deviceId);
  };

  const _hasDevice = (needleDevice: MediaDeviceInfo, newDevices: MediaDeviceInfo[]): boolean => {
    return (
      newDevices.find(newDevice => {
        if (needleDevice.deviceId === 'default') {
          return (
            newDevice.deviceId === needleDevice.deviceId &&
            newDevice.groupId === needleDevice.groupId
          );
        }

        return newDevice.deviceId === needleDevice.deviceId;
      }) !== undefined
    );
  };

  const _devicesChangedEvent = (newDevices: MediaDeviceInfo[]): void => {
    console.log('[STOOA] Devices changed:', newDevices);

    if (newDevices.length === 0) {
      return;
    }

    const parsedDevices = parseDevices(newDevices);
    setDevices(parsedDevices);
  };

  const selectAudioOutputDevice = (deviceId: string): void => {
    const device = _findDevice(deviceId, devices.audioOutputDevices);

    if (!device) {
      return;
    }

    userRepository.setUserAudioOutput(device);
    setAudioOutputDevice(device);
  };

  const selectAudioInputDevice = (deviceId: string): void => {
    const device = _findDevice(deviceId, devices.audioInputDevices);

    if (!device) {
      return;
    }

    userRepository.setUserAudioInput(device);
    setAudioInputDevice(device);
  };

  const selectVideoDevice = (deviceId: string): void => {
    const device = _findDevice(deviceId, devices.videoDevices);

    if (!device) {
      return;
    }

    userRepository.setUserVideoInput(device);
    setVideoDevice(device);
  };

  useEventListener(PERMISSION_CHANGED, permissions => {
    if (permissions.detail) {
      setPermissions(permissions.detail);
    }
  });

  useEffect(() => {
    if (
      devices.audioOutputDevices.length > 0 &&
      (audioOutputDevice === null || !_hasDevice(audioOutputDevice, devices.audioOutputDevices))
    ) {
      userRepository.setUserAudioOutput(devices.audioOutputDevices[0]);
      setAudioOutputDevice(devices.audioOutputDevices[0]);
    }

    if (
      devices.audioInputDevices.length > 0 &&
      (audioInputDevice === null || !_hasDevice(audioInputDevice, devices.audioInputDevices))
    ) {
      userRepository.setUserAudioInput(devices.audioInputDevices[0]);
      setAudioInputDevice(devices.audioInputDevices[0]);
    }

    if (
      devices.videoDevices.length > 0 &&
      (videoDevice === null || !_hasDevice(videoDevice, devices.videoDevices))
    ) {
      userRepository.setUserVideoInput(devices.videoDevices[0]);
      setVideoDevice(devices.videoDevices[0]);
    }

    _getPermissions()
      .then(browserPermissions => {
        setPermissions(browserPermissions);
      })
      .catch(err => {
        console.error('[STOOA] Error getting permissions:', err);
      });
  }, [devices]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    devicesRepository.loadDevices(_devicesChangedEvent);

    return () => {
      devicesRepository.clean(_devicesChangedEvent);
    };
  }, []);

  return (
    <DevicesContextProvider
      value={{
        selectAudioOutputDevice,
        selectAudioInputDevice,
        selectVideoDevice,
        setDevices,
        audioOutputDevice,
        audioInputDevice,
        videoDevice,
        devices,
        permissions,
        showModalPermissions,
        setShowModalPermissions
      }}
    >
      {children}
    </DevicesContextProvider>
  );
};

export { DevicesProvider, useDevices };
