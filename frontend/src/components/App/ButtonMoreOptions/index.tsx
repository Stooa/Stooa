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
import Feedback from '@/ui/svg/feedback.svg';
import Settings from '@/ui/svg/settings.svg';
import Rec from '@/ui/svg/rec-red.svg';
import StopRec from '@/ui/svg/stop-record.svg';
import MicIcon from '@/ui/svg/mic.svg';
import SpeakerIcon from '@/ui/svg/speaker.svg';
import VideoIcon from '@/ui/svg/video.svg';
import CheckIcon from '@/ui/svg/checkmark.svg';
import Cross from '@/ui/svg/cross.svg';
import PermissionsAlert from '@/ui/svg/permissions-alert.svg';

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
import { useModals } from '@/contexts/ModalsContext';
import { useNavigatorType } from '@/hooks/useNavigatorType';
import { supportsCaptureHandle } from '@/lib/helpers';
import Conference from '@/jitsi/Conference';
import { LOCALES } from '@/lib/locales';

interface Props {
  unlabeled?: boolean;
  selectorPosition?: 'top' | 'bottom';
  prejoin?: boolean;
}

type ButtonHandle = {
  handleShowDevices: (shouldShowDevices?: boolean) => void;
};

const ButtonMoreOptions: React.ForwardRefRenderFunction<ButtonHandle, Props> = (
  { unlabeled, selectorPosition, prejoin },
  ref
) => {
  const [showDevices, setShowDevices] = useState(false);
  const { setShowStopRecording, showStartRecording, setShowStartRecording, setShowFeedbackForm } =
    useModals();
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

  const {
    data,
    isModerator,
    isRecording,
    feedbackAlert,
    gaveFeedback,
    isTranscriptionEnabled,
    setIsTranscriptionEnabled
  } = useStooa();

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

  const handleShowFeedbackForm = () => {
    setShowFeedbackForm(current => !current);
  };

  const handleTranscriptionToggle = () => {
    if (isTranscriptionEnabled) {
      Conference.stopTranscriptionEvent();
      setIsTranscriptionEnabled(false);
    } else {
      Conference.startTranscriptionEvent();
      Conference.changeTranscriptionLanguage(LOCALES[data.locale]);
      setIsTranscriptionEnabled(true);
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
          data-testid="more-options-button"
          className={`body-sm ${showDevices ? 'active' : ''}`}
          onClick={() => handleShowDevices()}
          active={true}
        >
          <div className="button">{prejoin ? <Settings /> : <Dots />}</div>
          {!unlabeled && (
            <div data-testid="label" className="text medium">
              {t('settings')}
            </div>
          )}
        </Button>
        {feedbackAlert && deviceType === 'Mobile' && !gaveFeedback && (
          <div className="alert" data-testid="permission-alert">
            <PermissionsAlert />
          </div>
        )}

        {showDevices && (
          <Selector top={selectorPosition === 'top'} bottom={selectorPosition === 'bottom'}>
            <div className="selector__sticky-wrapper">
              {deviceType === 'Mobile' && !prejoin && (
                <button
                  disabled={gaveFeedback}
                  data-testid="feedback-button"
                  className="sticky-button sticky-button--feedback"
                  onClick={() => handleShowFeedbackForm()}
                >
                  {feedbackAlert && !gaveFeedback && (
                    <div className="alert" data-testid="permission-alert">
                      <PermissionsAlert />
                    </div>
                  )}
                  <Feedback />
                  {t('feedback.title')}
                </button>
              )}

              {!prejoin && (
                <button
                  disabled={gaveFeedback}
                  data-testid="transcription-button"
                  className="sticky-button sticky-button--transcription"
                  onClick={() => handleTranscriptionToggle()}
                >
                  <Feedback />
                  {isTranscriptionEnabled
                    ? t('transcription.titleDisable')
                    : t('transcription.titleEnable')}
                </button>
              )}

              {isModerator && supportsCaptureHandle() && deviceType === 'Desktop' && !prejoin && (
                <button
                  data-testid="recording-button"
                  className="sticky-button"
                  onClick={() => handleShowRecordingModal()}
                >
                  {isRecording ? (
                    <>
                      <StopRec />
                      {t('recording.stop')}
                    </>
                  ) : (
                    <>
                      <Rec />
                      {t('recording.start')}
                    </>
                  )}
                </button>
              )}
            </div>

            {devices.audioInputDevices.length > 0 && (
              <List>
                <li className="title">
                  <MicIcon /> {t('mic')}
                </li>
                {!permissions.audio ? (
                  <PermissionsNotGranted data-testid="no-audio-input-devices">
                    <Cross />
                    <span>{t('permissionsNotGranted')}</span>
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
                  <PermissionsNotGranted data-testid="no-audio-output-devices">
                    <Cross />
                    <span>{t('permissionsNotGranted')}</span>
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
            {devices.videoDevices.length > 0 && (
              <List>
                <li className="title">
                  <VideoIcon /> {t('cam')}
                </li>
                {!permissions.video ? (
                  <PermissionsNotGranted data-testid="no-video-devices">
                    <Cross />
                    <span>{t('permissionsNotGranted')}</span>
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
          </Selector>
        )}
      </Container>
    </>
  );
};

export default forwardRef(ButtonMoreOptions);
export type { ButtonHandle };
