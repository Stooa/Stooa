/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { User } from '@/types/user';
import { join, leave } from '@/lib/jitsi';
import tracksRepository from '@/jitsi/Tracks';
import { IConferenceStatus, ITimeStatus } from '@/jitsi/Status';
import devicesRepository from '@/jitsi/Devices';
import userRepository from '@/jitsi/User';
import { useStooa } from '@/contexts/StooaManager';
import useSeatsAvailable from '@/hooks/useSeatsAvailable';
import ButtonJoin from '@/components/App/ButtonJoin';
import ButtonMic from '@/components/App/ButtonMic';
import ButtonVideo from '@/components/App/ButtonVideo';
import ButtonMoreOptions, { ButtonHandle } from '@/components/App/ButtonMoreOptions';
import { StyledToolbar } from '@/components/App/ToolBar/styles';
import { useDevices } from '@/contexts/DevicesContext';
import useEventListener from '@/hooks/useEventListener';
import ReactionsButton from '../Reactions/ReactionsButton';
import ScreenShareButton from '../ScreenShareButton';
import Conference from '@/jitsi/Conference';
import SharedTrack from '@/jitsi/SharedTrack';
import { pushEventDataLayer } from '@/lib/analytics';
import { useNavigatorType } from '@/hooks/useNavigatorType';
import Feedback from '@/components/App/Feedback';

const ToolBar: React.FC = () => {
  const { t } = useTranslation('fishbowl');

  const [joined, setJoined] = useState(false);
  const [joinIsInactive, setJoinIsInactive] = useState(false);
  const {
    data,
    isModerator,
    conferenceStatus,
    timeStatus,
    conferenceReady,
    isSharing,
    setIsSharing,
    clientRunning
  } = useStooa();
  const { videoDevice, audioInputDevice, audioOutputDevice, permissions } = useDevices();
  const seatsAvailable = useSeatsAvailable();
  const { deviceType } = useNavigatorType();

  const configButtonRef = useRef<ButtonHandle>(null);

  const handleShareClick = async () => {
    if (isSharing) {
      const shareLocalTrack = Conference.getLocalTracks().filter(
        track => track.videoType === 'desktop'
      );

      setIsSharing(false);
      await SharedTrack.removeShareTrack(shareLocalTrack[0], 'app');
    } else {
      pushEventDataLayer({
        action: 'click_share',
        category: 'Sharescreen',
        label: window.location.href
      });

      const selectedScreen = await devicesRepository.screenShare();

      if (selectedScreen) {
        pushEventDataLayer({
          action: 'share',
          category: 'Sharescreen',
          label: window.location.href
        });
        setIsSharing(true);
      }
    }
  };

  const joinSeat = async (user: User) => {
    setJoinIsInactive(true);
    if (!joined) {
      await join(user);

      setTimeout(() => {
        setJoined(true);
        setJoinIsInactive(false);
      }, 1200);
    }
  };

  const leaveSeat = async () => {
    setJoinIsInactive(true);
    if (joined) {
      await leave();

      setTimeout(() => {
        setJoined(false);
        setJoinIsInactive(false);
      }, 1200);
    }
  };

  const hasModeratorToSeatDuringIntroduction = (): boolean => {
    return (
      (data.hasIntroduction ?? false) &&
      isModerator &&
      conferenceReady &&
      conferenceStatus === IConferenceStatus.INTRODUCTION
    );
  };

  const hasModeratorToSeatDuringRunning = (): boolean => {
    return (
      !data.hasIntroduction &&
      isModerator &&
      conferenceReady &&
      data.currentStatus?.toUpperCase() === IConferenceStatus.NOT_STARTED
    );
  };

  const handleMic = () => {
    if (configButtonRef.current) {
      configButtonRef.current.handleShowDevices(false);
    }

    tracksRepository.toggleAudioTrack();
  };

  const handleVideo = () => {
    if (configButtonRef.current) {
      configButtonRef.current.handleShowDevices(false);
    }

    tracksRepository.toggleVideoTrack();
  };

  const handleOutsideClick = event => {
    if (
      configButtonRef.current &&
      typeof event.target.className === 'string' &&
      event.target.id !== 'config-button' &&
      !event.target.className?.includes('device')
    ) {
      configButtonRef.current.handleShowDevices(false);
    }
  };

  useEventListener('click', handleOutsideClick);

  useEffect(() => {
    if (audioOutputDevice !== null) {
      devicesRepository.changeDevice(audioOutputDevice);
    }
  }, [audioOutputDevice]);

  useEffect(() => {
    if (joined && audioInputDevice !== null) {
      devicesRepository.changeDevice(audioInputDevice);
    }
  }, [audioInputDevice, permissions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (joined && videoDevice !== null) {
      devicesRepository.changeDevice(videoDevice);
    }
  }, [videoDevice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasModeratorToSeatDuringIntroduction()) {
      console.log('[STOOA] Moderator join seat during introduction');
      joinSeat(userRepository.getUser());
    }
  }, [conferenceStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasModeratorToSeatDuringRunning()) {
      console.log('[STOOA] Moderator join seat during running');
      joinSeat(userRepository.getUser());
    }
  }, [conferenceReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActionDisabled =
    !conferenceReady ||
    conferenceStatus === IConferenceStatus.NOT_STARTED ||
    (conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator) ||
    (conferenceStatus === IConferenceStatus.INTRODUCTION && joined && isModerator) ||
    (timeStatus === ITimeStatus.TIME_UP && !isModerator && !joined) ||
    (!joined && !seatsAvailable) ||
    joinIsInactive;

  const isMuteDisabled =
    !conferenceReady ||
    !joined ||
    conferenceStatus === IConferenceStatus.NOT_STARTED ||
    (conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator);

  const showShareScreenButton = useMemo(
    () =>
      isModerator &&
      conferenceStatus === IConferenceStatus.INTRODUCTION &&
      deviceType === 'Desktop',
    [conferenceStatus, isModerator, deviceType]
  );

  const isReactionsEnabled = conferenceStatus !== IConferenceStatus.NOT_STARTED;

  const joinLabel = joined ? t('leave') : !seatsAvailable ? t('full') : t('join');

  return (
    <StyledToolbar
      className={`${conferenceStatus === IConferenceStatus.INTRODUCTION ? 'introduction' : ''} ${
        isModerator ? 'moderator' : ''
      }`}
    >
      <Feedback />
      <ButtonJoin
        permissions={joined ? true : permissions.audio}
        joined={joined}
        join={joinSeat}
        leave={leaveSeat}
        disabled={isActionDisabled}
      >
        {joinLabel}
      </ButtonJoin>
      {showShareScreenButton && (
        <ScreenShareButton
          className="screen-share-button"
          data-testid="share-screen-button"
          isSharing={isSharing}
          onClick={handleShareClick}
          disabled={clientRunning}
        />
      )}
      <ReactionsButton disabled={!isReactionsEnabled} />
      <ButtonMic handleMic={handleMic} joined={joined} disabled={isMuteDisabled} />
      <ButtonVideo
        handleVideo={handleVideo}
        joined={joined}
        disabled={isMuteDisabled || !permissions.video}
      />
      <ButtonMoreOptions selectorPosition="top" ref={configButtonRef} />
    </StyledToolbar>
  );
};

export default ToolBar;
