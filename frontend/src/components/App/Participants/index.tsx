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

import { Participant } from '@/types/participant';
import { pushEventDataLayer } from '@/lib/analytics';
import { getTranscriptionLanguage, ping } from '@/user/auth';
import { getParticipantList } from '@/lib/jitsi';
import ParticipantCard from '@/components/App/Participants/ParticipantCard';

import ChevronLeft from '@/ui/svg/chevron-left.svg';
import ChevronRight from '@/ui/svg/chevron-right.svg';
import Cross from '@/ui/svg/cross.svg';
import People from '@/ui/svg/people.svg';
import Curve from '@/ui/svg/participants-curve.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';

import { ParticipantsDrawer, ParticipantsToggle, Icon } from '@/components/App/Participants/styles';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import { useStooa } from '@/contexts/StooaManager';
import { getApiParticipantList } from '@/repository/ApiParticipantRepository';
import { useModals } from '@/contexts/ModalsContext';
import { TranscriptionHistory } from '../TranscriptionText/TranscriptionHistory';

import Conference from '@/jitsi/Conference';
import TranslateSelector from '../TranslateSelector';
import { LOCALES } from '@/lib/supportedTranslationLanguages';
import Switch from '@/components/Common/Fields/updated/Switch';
import { useForm } from 'react-hook-form';
import TranscriptionSelector from '../TranscriptionSelector/TranscriptionSelector';
import SpinningLoader from '@/components/Common/SpinningLoader/SpinningLoader';

const initialParticipant: Participant = {
  id: '',
  name: '',
  linkedin: '',
  twitter: '',
  isModerator: false,
  isCurrentUser: false,
  guestId: '',
  joined: false,
  isMuted: false,
  isVideoMuted: false,
  isJigasi: false,
  getId: () => '',
  getDisplayName: () => ''
};

interface Props {
  initialized: boolean;
  fid: string;
}

const PING_TIMEOUT = 3500;

const Participants: React.FC<Props> = ({ initialized, fid }) => {
  const { t, lang } = useTranslation('fishbowl');
  const pingInterval = useRef<number>();
  const getParticipantsInterval = useRef<number>();
  const [participants, setParticipants] = useState<Participant[]>([initialParticipant]);
  const [speakingParticipants, setSpeakingParticipants] = useState<Participant[]>([
    initialParticipant
  ]);
  const [roomParticipants, setRoomParticipants] = useState<Participant[]>([initialParticipant]);

  const {
    data,
    getPassword,
    isTranscriptionEnabled,
    participantsActive,
    setParticipantsActive,
    setIsTranscriptionLoading,
    isTranscriptionLoading,
    setIsTranscriptionEnabled
  } = useStooa();

  const { register, setValue } = useForm({
    defaultValues: { transcript: isTranscriptionEnabled || isTranscriptionLoading }
  });

  const { showOnBoardingTour, setShowTranscriptionModal } = useModals();

  const pingParticipant = () => {
    ping(lang, fid);
  };

  const getApiParticipants = () => {
    getApiParticipantList(lang, fid)
      .then(participantList => {
        setParticipants(participantList);
      })
      .catch(error => {
        console.log('[STOOA] Error getting participants', error);
      });
  };

  const getConferenceParticipants = () => {
    const participantsWithoutTranscriber = getParticipantList().filter(participant => {
      return !participant.isJigasi;
    }) as unknown as Participant[];

    setParticipants(participantsWithoutTranscriber);
  };

  const toggleDrawer = () => {
    pushEventDataLayer({
      action: participantsActive ? 'Participants close' : 'Participants open',
      category: 'Header',
      label: window.location.href
    });

    setParticipantsActive(current => !current);
  };

  const sortHost = (a: Participant, b: Participant) => {
    if (a.isModerator) return -1;
    if (b.isModerator) return 1;
    return 0;
  };

  const handleOnChangeTranscription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cookieTranscription = getTranscriptionLanguage();
    if (!cookieTranscription) {
      setShowTranscriptionModal(true);
      return;
    }

    if (event.target.checked) {
      Conference.startTranscriptionEvent();
      Conference.setTranscriptionLanguage(cookieTranscription);
      setIsTranscriptionLoading(true);
    } else {
      Conference.stopTranscriptionEvent();
      setIsTranscriptionEnabled(false);
    }
  };

  useEffect(() => {
    if (!initialized) {
      pingParticipant();
      getApiParticipants();

      pingInterval.current = window.setInterval(pingParticipant, PING_TIMEOUT);
      getParticipantsInterval.current = window.setInterval(getApiParticipants, PING_TIMEOUT);
    } else {
      pingParticipant();
      window.clearInterval(pingInterval.current);
      window.clearInterval(getParticipantsInterval.current);

      setTimeout(() => {
        // Each 1 second it will fetch users from Jitsi to show the sidebar and user count correctly
        getParticipantsInterval.current = window.setInterval(getConferenceParticipants, 1000);
      }, PING_TIMEOUT);
    }

    return () => {
      window.clearInterval(pingInterval.current);
      window.clearInterval(getParticipantsInterval.current);
    };
  }, [initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const tempSpeakingParticipants = participants
      .sort(sortHost)
      .filter(participant => participant.joined && participant.name !== '');
    const tempRoomParticipants = participants
      .sort(sortHost)
      .filter(participant => !participant.joined && participant.name !== '');

    setSpeakingParticipants(tempSpeakingParticipants);
    setRoomParticipants(tempRoomParticipants);
  }, [participants]);

  useEffect(() => {
    if (showOnBoardingTour) {
      setParticipantsActive(false);
    }
  }, [showOnBoardingTour]);

  useEffect(() => {
    setValue('transcript', isTranscriptionEnabled || isTranscriptionLoading);
  }, [isTranscriptionEnabled, isTranscriptionLoading]);

  return (
    <>
      <ParticipantsToggle
        id="participant-toggle"
        as="button"
        className={`participant-toggle ${participantsActive ? 'active' : ''} `}
        onClick={toggleDrawer}
      >
        <Curve className="curve" />
        {participantsActive && <ChevronRight className="toggle-icon" />}
        {!participantsActive && <ChevronLeft className="toggle-icon" />}
        <People />
        <span className="body-xs medium">
          {participants.length === 0 ? 1 : participants.length}
        </span>
      </ParticipantsToggle>
      <ParticipantsDrawer className={participantsActive ? 'active' : ''}>
        <div>
          <div className="header">
            <h2 className="body-sm medium">{t('fishbowl:participants.title')}</h2>
            <ButtonCopyUrl
              variant="text"
              fid={data.slug}
              locale={data.locale}
              isPrivate={data.isPrivate}
              plainPassword={getPassword()}
            />
            <Icon onClick={toggleDrawer}>
              <Cross />
            </Icon>
          </div>
          <div className="participants-wrapper">
            {speakingParticipants.length > 0 && (
              <div className="participant-list participant-list--speaking">
                <h3 className="body-xs medium caps">{t('fishbowl:participants.speaking')}</h3>
                <ul>
                  {speakingParticipants.map((participant, i) => (
                    <ParticipantCard
                      participant={participant}
                      key={`participant-speaking-${i}`}
                      speaker={true}
                    />
                  ))}
                </ul>
              </div>
            )}
            {roomParticipants.length > 0 && (
              <div className="participant-list">
                <h3 className="body-xs medium caps">
                  <span>{t('fishbowl:participants.attendees')}</span>
                  <MicMuted className="icon-small" />
                  <VideoMuted className="icon-small" />
                </h3>
                <ul>
                  {roomParticipants.map((participant, i) => (
                    <ParticipantCard participant={participant} key={`participant-room-${i}`} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {process.env.NEXT_PUBLIC_TRANSCRIPTIONS_ENABLED === 'true' && (
          <div className="transcription-container">
            <hr />
            <div className="transcription-wrapper">
              <div className="transcription__header">
                <h3 className="body-md medium">Transcriptions</h3>

                <Switch
                  id="transcript"
                  {...register('transcript', {
                    onChange: event => {
                      handleOnChangeTranscription(event);
                    }
                  })}
                />

                {isTranscriptionLoading && <SpinningLoader />}
              </div>
              {(isTranscriptionEnabled || isTranscriptionLoading) && (
                <TranscriptionSelector tooltip />
              )}
              <TranslateSelector />
              <TranscriptionHistory />
            </div>
          </div>
        )}
      </ParticipantsDrawer>
    </>
  );
};

export default Participants;
