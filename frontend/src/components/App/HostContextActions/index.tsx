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
import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Trans from 'next-translate/Trans';
import ReasonForm from '@/components/App/HostContextActions/ReasonForm';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import conferenceRepository from '@/jitsi/Conference';
import useEventListener from '@/hooks/useEventListener';
import { SEATS_CHANGE } from '@/jitsi/Events';
import { Participant } from '@/types/participant';

interface HostContextActionsProps {
  initialParticipant: Participant;
  seat: number;
}

type SeatsChangeProps = {
  detail: {
    seats: [];
    seatsValues: [];
  };
};

const HostContextActions: React.FC<HostContextActionsProps> = ({ initialParticipant, seat }) => {
  const { t } = useTranslation('fishbowl');
  const [show, setShow] = useState<boolean>(false);
  const [participant, setParticipant] = useState<Participant>(initialParticipant);
  const { isModerator } = useStooa();
  const [{ fishbowlReady, conferenceStatus }] = useStateValue();
  const isMyself = participant ? participant.isCurrentUser : false;

  const showHostContextActions = () => {
    return (
      participant &&
      isModerator &&
      fishbowlReady &&
      !isMyself &&
      conferenceStatus === IConferenceStatus.RUNNING
    );
  };

  const closeModal = (): void => {
    setShow(false);
  };

  const showModal = (): void => {
    setShow(true);
  };

  useEventListener(SEATS_CHANGE, ({ detail: { seatsValues } }: SeatsChangeProps) => {
    if (seatsValues[seat]) {
      setParticipant(conferenceRepository.getParticipantById(seatsValues[seat]));
    } else {
      setParticipant(null);
    }
  });

  useEffect(() => {
    if (show && initialParticipant) {
      setParticipant(conferenceRepository.getParticipantById(initialParticipant.id));
    }
  }, [show]);

  return (
    <>
      {showHostContextActions() && (
        <Button
          style={{ zIndex: 9, position: 'absolute', top: '12px', right: '12px', padding: '10px' }}
          variant="secondary"
          className="never-full"
          onClick={showModal}
        >
          <span>{t('kick.button')}</span>
        </Button>
      )}
      {show && participant && (
        <Modal>
          <div className="content">
            <button className="close" onClick={closeModal}>
              <Cross />
            </button>

            <h2 className="title-sm">
              {t('kick.modal.title', {
                userName: initialParticipant
                  ? initialParticipant.name
                  : participant.getDisplayName()
              })}
            </h2>
            <p className="description">
              <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
            </p>
            <ReasonForm participant={participant} showModal={show} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default HostContextActions;
