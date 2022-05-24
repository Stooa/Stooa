/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import Button from '@/components/Common/Button';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import KickReasonForm from '@/components/App/KickReasonForm';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import conferenceRepository from '@/jitsi/Conference';
import useEventListener from '@/hooks/useEventListener';
import { SEATS_CHANGE } from '@/jitsi/Events';
import { Participant } from '@/types/participant';
import ModalKickUser from '../ModalKickUser';

interface Props {
  initialParticipant?: Participant;
  seatNumber?: number;
}

type SeatsChangeEventProps = {
  detail: {
    seats: [];
    seatsValues: [];
  };
};

const HostContextActions = ({ initialParticipant, seatNumber = null }: Props) => {
  const { t } = useTranslation('fishbowl');
  const [showKickReasonsModal, setShowKickReasonsModal] = useState<boolean>(false);
  const [participant, setParticipant] = useState<Participant>(initialParticipant);
  const { isModerator } = useStooa();
  const [{ fishbowlReady, conferenceStatus }] = useStateValue();
  const isMyself = participant ? participant.isCurrentUser : false;

  const showKickButton = () => {
    return (
      participant &&
      isModerator &&
      fishbowlReady &&
      !isMyself &&
      conferenceStatus === IConferenceStatus.RUNNING
    );
  };

  const closeModal = (): void => {
    setShowKickReasonsModal(false);
  };

  const showModal = (): void => {
    setShowKickReasonsModal(true);
  };

  const getParticipantName = (): string => {
    return initialParticipant ? initialParticipant.name : participant.getDisplayName();
  };

  useEventListener(SEATS_CHANGE, ({ detail: { seatsValues } }: SeatsChangeEventProps) => {
    const participantId = seatsValues[seatNumber];

    if (participantId) {
      setParticipant(conferenceRepository.getParticipantById(participantId));
    } else {
      setParticipant(null);
    }
  });

  useEffect(() => {
    if (showKickReasonsModal && initialParticipant) {
      setParticipant(conferenceRepository.getParticipantById(initialParticipant.id));
    }
  }, [showKickReasonsModal]);

  return (
    <>
      {showKickButton() && seatNumber && (
        <Button
          style={{ zIndex: 9, position: 'absolute', top: '12px', right: '12px', padding: '10px' }}
          variant="secondary"
          className="never-full"
          onClick={showModal}
        >
          <span>{t('kick.button')}</span>
        </Button>
      )}
      {showKickReasonsModal && (
        <ModalKickUser closeModal={() => closeModal()}>
          <>
            <h2 className="title-sm">
              {t('kick.modal.title', {
                userName: getParticipantName()
              })}
            </h2>
            <p className="body-xs subtitle">
              <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
            </p>
            <KickReasonForm participant={participant} onSubmit={() => closeModal()} />
          </>
        </ModalKickUser>
      )}
    </>
  );
};

export default HostContextActions;
