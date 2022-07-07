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

const PING_TIMEOUT = 3500;
const MAX_FAKE_PARTICIPANTS = 10;

const PreFishbowlParticipants: React.FC = ({}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { lang } = useTranslation('fishbowl');
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
    let fakeParticipants = [];

    for (let i = 0; i < numFakeParticipants; i++) {
      fakeParticipants.push(<div key={i}>fake participant</div>);
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
  }, [participants]);

  return (
    <div>
      {participants.length > 0 ? (
        <div className="participant-list">
          <div>
            <div className="col-left">
              <h3 className="caps col-left">Participants in the room</h3>
            </div>
            <div className="col-right">
              <People />
              <span className="body-xs medium">
                {participants.length === 0 ? 1 : participants.length}
              </span>
            </div>
          </div>
          <div>
            <ul>
              {participants.map((participant, i) => (
                <ParticipantCard
                  participant={participant}
                  key={`participant-speaking-${i}`}
                  speaker={true}
                />
              ))}
              {createFakeParticipants()}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default PreFishbowlParticipants;
