/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState } from 'react';
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
import ButtonConfig from '@/components/App/ButtonConfig';
import { Container } from '@/components/App/ToolBar/styles';
import { useDevices } from '@/contexts/DevicesContext';
import useEventListener from '@/hooks/useEventListener';

const ToolBar: React.FC = () => {
  const [joined, setJoined] = useState(false);
  const [joinIsInactive, setJoinIsInactive] = useState(false);
  const { data, isModerator, conferenceStatus, timeStatus, conferenceReady } = useStooa();
  const { videoDevice, audioInputDevice, audioOutputDevice } = useDevices();
  const seatsAvailable = useSeatsAvailable();
  const { t } = useTranslation('fishbowl');

  const configButtonRef = useRef(null);

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
      data.hasIntroduction &&
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
      data.currentStatus.toUpperCase() === IConferenceStatus.NOT_STARTED
    );
  };

  const handleMic = () => {
    configButtonRef.current.handleShowDevices(false);
    tracksRepository.toggleAudioTrack();
  };

  const handleVideo = () => {
    configButtonRef.current.handleShowDevices(false);
    tracksRepository.toggleVideoTrack();
  };

  const handleOutsideClick = event => {
    if (typeof event.target.className === 'string') {
      if (event.target.id !== 'config-button' && !event.target.className?.includes('device')) {
        configButtonRef.current.handleShowDevices(false);
      }
    }
  };

  useEventListener('click', handleOutsideClick);

  useEffect(() => {
    if (null !== audioOutputDevice) {
      devicesRepository.changeDevice(audioOutputDevice);
    }
  }, [audioOutputDevice]);

  useEffect(() => {
    if (joined && null !== audioInputDevice) {
      devicesRepository.changeDevice(audioInputDevice);
    }
  }, [audioInputDevice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (joined && null !== videoDevice) {
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
    conferenceStatus === IConferenceStatus.INTRODUCTION ||
    (timeStatus === ITimeStatus.TIME_UP && !isModerator && !joined) ||
    (!joined && !seatsAvailable) ||
    joinIsInactive;

  const isMuteDisabled =
    !conferenceReady ||
    !joined ||
    conferenceStatus === IConferenceStatus.NOT_STARTED ||
    (conferenceStatus === IConferenceStatus.INTRODUCTION && !isModerator);

  const joinLabel = joined ? t('leave') : !seatsAvailable ? t('full') : t('join');

  return (
    <Container className={isModerator ? 'moderator' : ''}>
      <ButtonJoin joined={joined} join={joinSeat} leave={leaveSeat} disabled={isActionDisabled}>
        {joinLabel}
      </ButtonJoin>
      <ButtonMic handleMic={handleMic} joined={joined} disabled={isMuteDisabled} />
      <ButtonVideo handleVideo={handleVideo} joined={joined} disabled={isMuteDisabled} />
      <ButtonConfig selectorPosition="top" ref={configButtonRef} />
    </Container>
  );
};

export default ToolBar;
