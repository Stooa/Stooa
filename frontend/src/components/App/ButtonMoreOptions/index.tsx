/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import Dots from '@/ui/svg/dots-toolbar.svg';
import Rec from '@/ui/svg/rec.svg';
import MicIcon from '@/ui/svg/mic.svg';
import SpeakerIcon from '@/ui/svg/speaker.svg';
import VideoIcon from '@/ui/svg/video.svg';
import CheckIcon from '@/ui/svg/checkmark.svg';
import Cross from '@/ui/svg/cross.svg';
import {
  Button,
  Container,
  Item,
  List,
  PermissionsNotGranted,
  Selector
} from '@/components/App/ButtonMoreOptions/styles';
import { useDevices } from '@/contexts/DevicesContext';
import { useStooa } from '@/contexts/StooaManager';
import useVideoRecorder from '@/hooks/useVideoRecorder';
import { useModals } from '@/contexts/ModalsContext';
import { useNavigatorType } from '@/hooks/useNavigatorType';

interface Props {
  unlabeled?: boolean;
  selectorPosition?: 'top' | 'bottom';
  noRecording?: boolean;
}

type ButtonHandle = {
  handleShowDevices: (shouldShowDevices?: boolean) => void;
};

const ButtonMoreOptions: React.ForwardRefRenderFunction<ButtonHandle, Props> = (
  { unlabeled, selectorPosition, noRecording },
  ref
) => {
  const [showDevices, setShowDevices] = useState(false);
  const { supportsCaptureHandle } = useVideoRecorder();
  const { setShowStopRecording, showStartRecording, setShowStartRecording } = useModals();
  const { deviceType } = useNavigatorType();

  const {
    devices,
    audioInputDevice,
    audioOutputDevice,
    videoDevice,
    selectAudioOutputDevice,
    selectAudioInputDevice,
    selectVideoDevice,
    permissions
  } = useDevices();

  const { isModerator, isRecording } = useStooa();

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

  const handleShowRecordingModal = () => {
    if (isRecording) {
      setShowStopRecording(true);
    } else {
      setShowStartRecording(true);
    }
  };

  // Used imperativeHandle to make the parents able to call the handleShowDevices
  // this way we keep the state inside the button config component
  useImperativeHandle(ref, () => ({
    handleShowDevices
  }));

  return (
    <>
      {showStartRecording && (
        <Head>
          <title>Stooa | 🎥 {t('recording.selectThisTab')}</title>
        </Head>
      )}

      <Container>
        <Button
          id="config-button"
          className={`body-sm ${showDevices ? 'active' : ''}`}
          onClick={() => handleShowDevices()}
          active={true}
        >
          <div className="button">
            <Dots />
          </div>
          {!unlabeled && <div className="text medium">{t('settings')}</div>}
        </Button>

        {showDevices && (
          <Selector top={selectorPosition === 'top'} bottom={selectorPosition === 'bottom'}>
            {isModerator && supportsCaptureHandle() && deviceType === 'Desktop' && !noRecording && (
              <button className="recording-button" onClick={() => handleShowRecordingModal()}>
                <Rec />
                {isRecording ? 'Stop recording' : 'Start recording'}
              </button>
            )}

            {devices.audioInputDevices.length > 0 && (
              <List>
                <li className="title">
                  <MicIcon /> {t('mic')}
                </li>
                {!permissions.audio ? (
                  <PermissionsNotGranted>
                    <Cross />
                    <span>Permission not granted</span>
                  </PermissionsNotGranted>
                ) : (
                  devices.audioInputDevices.map(({ deviceId, label }) => (
                    <li key={deviceId}>
                      <Item
                        className="body-sm device"
                        selected={audioInputDevice?.deviceId === deviceId}
                        onClick={handleAudioInput}
                        value={deviceId}
                      >
                        <CheckIcon />
                        <span>
                          {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                        </span>
                      </Item>
                    </li>
                  ))
                )}
              </List>
            )}
            {devices.audioOutputDevices.length > 0 && (
              <List>
                <li className="title">
                  <SpeakerIcon /> {t('speaker')}
                </li>
                {!permissions.audio ? (
                  <PermissionsNotGranted>
                    <Cross />
                    <span>Permission not granted</span>
                  </PermissionsNotGranted>
                ) : (
                  devices.audioOutputDevices.map(({ deviceId, label }) => (
                    <li key={deviceId}>
                      <Item
                        className="body-sm device"
                        selected={audioOutputDevice?.deviceId === deviceId}
                        onClick={handleAudioOutput}
                        value={deviceId}
                      >
                        <CheckIcon />{' '}
                        <span>
                          {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                        </span>
                      </Item>
                    </li>
                  ))
                )}
              </List>
            )}
            {devices.videoDevices.length > 0 && (
              <List>
                <li className="title">
                  <VideoIcon /> {t('cam')}
                </li>
                {!permissions.video ? (
                  <PermissionsNotGranted>
                    <Cross />
                    <span>Permission not granted</span>
                  </PermissionsNotGranted>
                ) : (
                  devices.videoDevices.map(({ deviceId, label }) => (
                    <li key={deviceId}>
                      <Item
                        className="body-sm device"
                        selected={videoDevice?.deviceId === deviceId}
                        onClick={handleVideoInput}
                        value={deviceId}
                      >
                        <CheckIcon />{' '}
                        <span>
                          {deviceId === 'default' ? `${t('sameAsSystem')} (${label})` : label}
                        </span>
                      </Item>
                    </li>
                  ))
                )}
              </List>
            )}
          </Selector>
        )}
      </Container>
    </>
  );
};

export default forwardRef(ButtonMoreOptions);
export type { ButtonHandle };
