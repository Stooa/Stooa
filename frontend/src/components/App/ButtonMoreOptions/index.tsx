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
import TranscriptionSVG from '@/ui/svg/transcription-icon.svg';
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
import { useConference } from '@/jitsi/useConference';
import { useUserAuth } from '@/user/auth/useUserAuth';

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
  const {
    setShowStopRecording,
    setShowTranscriptionModal,
    showStartRecording,
    setShowStartRecording,
    setShowFeedbackForm
  } = useModals();
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
    setIsTranscriptionEnabled,
    setParticipantsActive,
    isTranscriberJoined
  } = useStooa();

  const { stopTranscriptionEvent, startTranscriptionEvent, setConferenceTranscriptionLanguage } =
    useConference();

  const { getTranscriptionLanguageCookie } = useUserAuth();

  const { t } = useTranslation('fishbowl');

  const getTranscriptionText = () => {
    if (isTranscriptionEnabled && !isTranscriberJoined) {
      return t('transcription.loading');
    }

    if (isTranscriptionEnabled) {
      return t('transcription.disable');
    } else {
      return t('transcription.enable');
    }
  };

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
    const transcriptionCookie = getTranscriptionLanguageCookie();

    if (!transcriptionCookie) {
      setShowTranscriptionModal(true);
      return;
    }

    if (isTranscriptionEnabled) {
      stopTranscriptionEvent(!!data.hasSummary);

      setIsTranscriptionEnabled(false);
    } else {
      startTranscriptionEvent();
      setConferenceTranscriptionLanguage(transcriptionCookie);
      if (deviceType === 'Desktop') {
        setParticipantsActive(true);
      }
      setIsTranscriptionEnabled(true);
      setShowTranscriptionModal(false);
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
              {deviceType === 'Mobile' && !prejoin && !isModerator && (
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

              {!prejoin && process.env.NEXT_PUBLIC_TRANSCRIPTIONS_ENABLED === 'true' && (
                <button
                  disabled={gaveFeedback}
                  data-testid="transcription-button"
                  className="sticky-button sticky-button--transcription"
                  onClick={() => handleTranscriptionToggle()}
                >
                  <TranscriptionSVG />
                  {getTranscriptionText()}
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
