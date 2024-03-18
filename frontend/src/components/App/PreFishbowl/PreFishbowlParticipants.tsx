/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState } from 'react';

import { Participant } from '@/types/participant';
import useTranslation from 'next-translate/useTranslation';
import ParticipantCard from '@/components/App/Participants/ParticipantCard';
import People from '@/ui/svg/people.svg';
import { useUserAuth } from '@/user/auth/useUserAuth';
import {
  StyledParticipantListWrapper,
  StyledParticipantList,
  StyledRegisterNotification
} from './styles';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import { ROUTE_FISHBOWL, ROUTE_REGISTER } from '@/app.config';

import ParticipantPlaceholder from '@/components/App/ParticipantPlaceholder';
import { pushEventDataLayer } from '@/lib/analytics';
import { getApiParticipantList } from '@/repository/ApiParticipantRepository';
import SpinningLoader from '@/components/Common/SpinningLoader/SpinningLoader';
import { EventType } from '@/types/event-types';

const PING_TIMEOUT = 3500;
const MAX_PLACEHOLDER_PARTICIPANTS = 10;

interface Props {
  isGuest: boolean;
  slug: string;
  eventType: EventType;
}

const PreFishbowlParticipants = ({ isGuest, slug, eventType }: Props) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { ping } = useUserAuth();
  const { t, lang } = useTranslation('fishbowl');
  const pingInterval = useRef<number>();
  const getParticipantsInterval = useRef<number>();
  const [numPlaceholderParticipants, setNumPlaceholderParticipants] = useState<number>(0);

  const pingParticipant = () => {
    ping(lang, slug as string, eventType);
  };

  const getApiParticipants = () => {
    getApiParticipantList(lang, slug as string, eventType)
      .then(participantList => {
        setParticipants(participantList);
      })
      .catch(error => {
        console.log('[STOOA] Error getting participants', error);
      });
  };

  const createPlaceholderParticipants = () => {
    const placeholderParticipants: JSX.Element[] = [];

    for (let i = 0; i < numPlaceholderParticipants; i++) {
      placeholderParticipants.push(<ParticipantPlaceholder key={i} />);
    }

    return placeholderParticipants;
  };

  useEffect(() => {
    pingInterval.current = window.setInterval(pingParticipant, PING_TIMEOUT);
    getParticipantsInterval.current = window.setInterval(getApiParticipants, PING_TIMEOUT);

    pingParticipant();
    getApiParticipants();

    return () => {
      window.clearInterval(pingInterval.current);
      window.clearInterval(getParticipantsInterval.current);
    };
  }, []);

  useEffect(() => {
    const placeholderParticipantsToPrint = MAX_PLACEHOLDER_PARTICIPANTS - participants.length;
    setNumPlaceholderParticipants(
      placeholderParticipantsToPrint > 0 ? placeholderParticipantsToPrint : 0
    );
  }, [participants]);

  return (
    <>
      <StyledParticipantListWrapper data-testid="prefishbowl-participants">
        <div className="participant-list__header">
          <h3 className="caps body-sm medium">{t('prefishbowl.participantsTitle')}</h3>

          <div className="participant-list__counter">
            <People />
            <span className="body-xs medium" data-test-id="prefishbowl-participants-number">
              {participants.length === 0 ? <SpinningLoader /> : participants.length}
            </span>
          </div>
        </div>

        {isGuest && (
          <StyledRegisterNotification data-testid="prefishbowl-register">
            <p className="body-sm">{t('prefishbowl.connectWithUsers')}</p>

            <RedirectLink
              href={`${ROUTE_REGISTER}?redirect=${ROUTE_FISHBOWL}/${slug}&prefishbowl=${slug}`}
              passHref
            >
              <Button
                onClick={() => {
                  pushEventDataLayer({
                    action: 'Register Intention',
                    category: 'Prefishbowl',
                    label: slug as string
                  });
                }}
                className="never-full"
                size="medium"
                as="a"
                data-testid="register"
              >
                <span>{t('common:register')}</span>
              </Button>
            </RedirectLink>
          </StyledRegisterNotification>
        )}

        <StyledParticipantList
          className={`${participants.length >= MAX_PLACEHOLDER_PARTICIPANTS ? 'scroll' : ''}`}
        >
          {participants.length > 0 &&
            participants.map((participant, i) => (
              <ParticipantCard preEvent={true} participant={participant} key={`participant-${i}`} />
            ))}
          {createPlaceholderParticipants()}
        </StyledParticipantList>
      </StyledParticipantListWrapper>
    </>
  );
};

export default PreFishbowlParticipants;
