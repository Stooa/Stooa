/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { Participant } from '@/types/participant';
import { pushEventDataLayer } from '@/lib/analytics';
import { getParticipants, ping } from '@/lib/auth';
import { getParticipantList } from '@/lib/jitsi';
import ParticipantCard from '@/components/App/Participants/Participant';

import ChevronLeft from '@/ui/svg/chevron-left.svg';
import ChevronRight from '@/ui/svg/chevron-right.svg';
import Cross from '@/ui/svg/cross.svg';
import People from '@/ui/svg/people.svg';
import Curve from '@/ui/svg/participants-curve.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import { ParticipantsDrawer, ParticipantsToggle, Icon } from '@/components/App/Participants/styles';

const initialParticipant = {
  id: '',
  name: '',
  linkedin: '',
  twitter: '',
  isModerator: false,
  isCurrentUser: false,
  guestId: '',
  joined: false,
  isMuted: false,
  isVideoMuted: false
};

interface Props {
  initialized: boolean;
  fid: string;
  toggleParticipants: () => void;
}

const PING_TIMEOUT = 3500;

const Participants: React.FC<Props> = ({ initialized, fid, toggleParticipants }) => {
  const { t, lang } = useTranslation('fishbowl');
  const [active, setActive] = useState(false);
  const [pingInterval, setPingInterval] = useState<number>(0);
  const [getParticipantsInterval, setGetParticipantsInterval] = useState<number>(0);
  const [participants, setParticipants] = useState<Participant[]>([initialParticipant]);
  const [speakingParticipants, setSpeakingParticipants] = useState<Participant[]>([
    initialParticipant
  ]);
  const [roomParticipants, setRoomParticipants] = useState<Participant[]>([initialParticipant]);

  const pingParticipant = () => {
    ping(lang, fid);
  };

  const getApiParticipants = () => {
    getParticipants(lang, fid)
      .then(({ data: { response } }) => {
        setParticipants(response || [initialParticipant]);
      })
      .catch(error => {
        console.log('[STOOA] Error getting participants', error);
      });
  };

  const getConferenceParticipants = () => {
    const typedParticipants = getParticipantList() as unknown as Participant[];
    setParticipants(typedParticipants);
  };

  const toggleDrawer = () => {
    pushEventDataLayer({
      action: active ? 'Participants close' : 'Participants open',
      category: 'Header',
      label: window.location.href
    });

    setActive(!active);
    toggleParticipants();
  };

  const sortHost = (a: Participant, b: Participant) => {
    if (a.isModerator) return -1;
    if (b.isModerator) return 1;
    return 0;
  };

  const handleShowMutedIcons = () => {
    participants.forEach(participant => {
      const participantElement = document.querySelector(
        `.participant[data-id="${participant.id}"]`
      );

      if (participantElement) {
        if (participant.isMuted) {
          participantElement.classList.add('user-muted-audio');
        } else {
          participantElement.classList.remove('user-muted-audio');
        }

        if (participant.isVideoMuted) {
          participantElement.classList.add('user-muted-video');
        } else {
          participantElement.classList.remove('user-muted-video');
        }
      }
    });
  };

  useEffect(() => {
    if (!initialized) {
      pingParticipant();
      getApiParticipants();

      setPingInterval(window.setInterval(pingParticipant, PING_TIMEOUT));
      setGetParticipantsInterval(window.setInterval(getApiParticipants, PING_TIMEOUT));
    } else {
      window.clearInterval(pingInterval);
      window.clearInterval(getParticipantsInterval);

      setTimeout(() => {
        // Each 1 second it will fetch users from Jitsi to show the sidebar and user count correctly
        setGetParticipantsInterval(window.setInterval(getConferenceParticipants, 1000));
      }, PING_TIMEOUT);
    }

    return () => {
      window.clearInterval(pingInterval);
      window.clearInterval(getParticipantsInterval);
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
    handleShowMutedIcons();
  }, [speakingParticipants, roomParticipants]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ParticipantsToggle as="button" className={active ? 'active' : ''} onClick={toggleDrawer}>
        <Curve className="curve" />
        {active && <ChevronRight className="toggle-icon" />}
        {!active && <ChevronLeft className="toggle-icon" />}
        <People />
        <span className="app-sm medium">{participants.length === 0 ? 1 : participants.length}</span>
      </ParticipantsToggle>
      <ParticipantsDrawer className={active ? 'active' : ''}>
        <div className="header">
          <h2 className="app-md medium">{t('fishbowl:participants.title')}</h2>
          <Icon onClick={toggleDrawer}>
            <Cross />
          </Icon>
        </div>
        {speakingParticipants.length > 0 && (
          <div className="participant-list participant-list--speaking">
            <h3 className="app-sm medium caps">{t('fishbowl:participants.speaking')}</h3>
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
            <h3 className="app-sm medium caps">
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
      </ParticipantsDrawer>
    </>
  );
};

export default Participants;
