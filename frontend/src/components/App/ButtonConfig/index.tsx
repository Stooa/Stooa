/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import SettingsIcon from '@/ui/svg/settings.svg';
import MicIcon from '@/ui/svg/mic.svg';
import SpeakerIcon from '@/ui/svg/speaker.svg';
import VideoIcon from '@/ui/svg/video.svg';
import CheckIcon from '@/ui/svg/checkmark.svg';
import { Button, Container, Item, List, Selector } from '@/components/App/ButtonConfig/styles';
import { useDevices } from '@/contexts/DevicesContext';

interface Props {
  unlabeled?: boolean;
  selectorPosition?: 'top' | 'bottom';
}

const ButtonConfig = forwardRef(({ unlabeled, selectorPosition }: Props, ref) => {
  const [showDevices, setShowDevices] = useState(false);

  const {
    devices,
    audioInputDevice,
    audioOutputDevice,
    videoDevice,
    selectAudioOutputDevice,
    selectAudioInputDevice,
    selectVideoDevice
  } = useDevices();
  const { t } = useTranslation('fishbowl');

  const handleAudioInput = (event: React.MouseEvent) => {
    const { value } = event.target as HTMLButtonElement;
    selectAudioInputDevice(value);
  };

  const handleAudioOutput = (event: React.MouseEvent) => {
    const { value } = event.target as HTMLButtonElement;
    selectAudioOutputDevice(value);
  };

  const handleVideoInput = (event: React.MouseEvent) => {
    const { value } = event.target as HTMLButtonElement;
    selectVideoDevice(value);
  };

  const handleShowDevices = (shouldShowDevices?: boolean) => {
    if (shouldShowDevices !== undefined) {
      setShowDevices(shouldShowDevices);
    } else {
      setShowDevices(!showDevices);
    }
  };

  // Used imperativeHandle to make the parents able to call the handleShowDevices
  // this way we keep the state inside the button config component
  useImperativeHandle(ref, () => ({
    handleShowDevices
  }));

  return (
    <Container>
      <Button
        id="config-button"
        className="text-sm"
        onClick={() => handleShowDevices()}
        active={true}
      >
        <div className="button">
          <SettingsIcon />
        </div>
        {!unlabeled && <span className="text medium">{t('settings')}</span>}
      </Button>
      {showDevices &&
        (devices.audioInputDevices.length > 0 ||
          devices.audioOutputDevices.length > 0 ||
          devices.videoDevices.length > 0) && (
          <Selector top={selectorPosition === 'top'} bottom={selectorPosition === 'bottom'}>
            {devices.audioInputDevices.length > 0 && (
              <List>
                <li className="title">
                  <MicIcon /> {t('mic')}
                </li>
                {devices.audioInputDevices.map(({ deviceId, label }) => (
                  <li key={deviceId}>
                    <Item
                      className="text-sm device"
                      selected={audioInputDevice.deviceId === deviceId}
                      onClick={handleAudioInput}
                      value={deviceId}
                    >
                      <CheckIcon />{' '}
                      <span>
                        {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                      </span>
                    </Item>
                  </li>
                ))}
              </List>
            )}
            {devices.audioOutputDevices.length > 0 && (
              <List>
                <li className="title">
                  <SpeakerIcon /> {t('speaker')}
                </li>
                {devices.audioOutputDevices.map(({ deviceId, label }) => (
                  <li key={deviceId}>
                    <Item
                      className="text-sm device"
                      selected={audioOutputDevice.deviceId === deviceId}
                      onClick={handleAudioOutput}
                      value={deviceId}
                    >
                      <CheckIcon />{' '}
                      <span>
                        {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                      </span>
                    </Item>
                  </li>
                ))}
              </List>
            )}
            {devices.videoDevices.length > 0 && (
              <List>
                <li className="title">
                  <VideoIcon /> {t('cam')}
                </li>
                {devices.videoDevices.map(({ deviceId, label }) => (
                  <li key={deviceId}>
                    <Item
                      className="text-sm device"
                      selected={videoDevice.deviceId === deviceId}
                      onClick={handleVideoInput}
                      value={deviceId}
                    >
                      <CheckIcon />{' '}
                      <span>
                        {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                      </span>
                    </Item>
                  </li>
                ))}
              </List>
            )}
          </Selector>
        )}
    </Container>
  );
});

export default ButtonConfig;
