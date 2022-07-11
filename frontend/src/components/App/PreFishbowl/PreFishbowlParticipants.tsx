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
import { getParticipants } from '@/lib/auth';
import router from 'next/router';
import {
  StyledParticipantListWrapper,
  StyledParticipantList,
  StyledPrefishbowlParticipant,
  StyledRegisterNotification
} from './styles';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import { ROUTE_REGISTER } from '@/app.config';

import Linkedin from '@/ui/svg/share-linkedin.svg';
import Twitter from '@/ui/svg/share-twitter.svg';

const PING_TIMEOUT = 3500;
const MAX_FAKE_PARTICIPANTS = 10;

const PreFishbowlParticipants: React.FC = ({}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { t, lang } = useTranslation('fishbowl');
  const { fid } = router.query;
  const getParticipantsInterval = useRef<number>();
  const [numFakeParticipants, setNumFakeParticipants] = useState<number>(0);

  const getApiParticipants = () => {
    getParticipants(lang, fid as string)
      .then(({ data: { response } }) => {
        setParticipants(response || []);
      })
      .catch(error => {
        console.log('[STOOA] Error getting participants', error);
      });
  };

  const createFakeParticipants = () => {
    const fakeParticipants = [];

    for (let i = 0; i < numFakeParticipants; i++) {
      fakeParticipants.push(
        <StyledPrefishbowlParticipant>
          <div className="placeholder" key={i}>
            <div />
          </div>
          <div className="social">
            <span className="icon">
              <Twitter />
            </span>

            <span className="icon">
              <Linkedin />
            </span>
          </div>
        </StyledPrefishbowlParticipant>
      );
    }

    return fakeParticipants;
  };

  useEffect(() => {
    getParticipantsInterval.current = window.setInterval(getApiParticipants, PING_TIMEOUT);

    getApiParticipants();

    return () => {
      window.clearInterval(getParticipantsInterval.current);
    };
  }, []);

  useEffect(() => {
    const fakeParticipantsToPrint = MAX_FAKE_PARTICIPANTS - participants.length;

    setNumFakeParticipants(fakeParticipantsToPrint > 0 ? fakeParticipantsToPrint : 0);
    console.log(participants[0]);
  }, [participants]);

  return (
    <div>
      <StyledParticipantListWrapper>
        <div className="participant-list__header">
          <h3 className="caps body-sm medium">Participants in the room</h3>

          <div className="participant-list__counter">
            <People />
            <span className="body-xs medium">
              {participants.length === 0 ? 1 : participants.length}
            </span>
          </div>
        </div>

        <StyledRegisterNotification>
          <p className="body-sm">
            To connect with the people in the room through your social networks, sign up for Stooa.
          </p>

          <RedirectLink href={ROUTE_REGISTER} passHref>
            <Button className="never-full" size="medium" as="a" data-testid="register">
              <span>{t('common:register')}</span>
            </Button>
          </RedirectLink>
        </StyledRegisterNotification>
        <StyledParticipantList className={`${participants.length >= 10 ? 'scroll' : ''}`}>
          {participants.length > 0 &&
            participants.map((participant, i) => (
              <ParticipantCard
                variant="prefishbowl"
                participant={participant}
                key={`participant-${i}`}
              />
            ))}
          {createFakeParticipants()}
        </StyledParticipantList>
      </StyledParticipantListWrapper>
    </div>
  );
};

export default PreFishbowlParticipants;
