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
import { User } from '@/types/user';
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

interface HostContextActionsProps {
  participant: User;
  seat: number;
}

type SeatsChangeProps = {
  detail: {
    seats: [];
    seatsValues: [];
  };
};

const HostContextActions: React.FC<HostContextActionsProps> = ({ participant, seat }) => {
  const { t } = useTranslation('fishbowl');
  const [show, setShow] = useState<boolean>(false);
  const [seatList, setSeatList] = useState<Array<string>>([]);
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
    setSeatList(seatsValues);
  });

  useEffect(() => {
    if (seat && seatList[seat]) {
      participant = conferenceRepository.getParticipantById(seatList[seat]);
    }
  }, [seatList]);

  return (
    <>
      {showHostContextActions() && (
        <Button variant="secondary" className="never-full" onClick={showModal}>
          <span>{t('kick.button')}</span>
        </Button>
      )}
      {show && (
        <Modal>
          <div className="content">
            <button className="close" onClick={closeModal}>
              <Cross />
            </button>
            <h2 className="title-sm">{t('kick.modal.title', { userName: participant.name })}</h2>
            <p className="description">
              <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
            </p>
            <ReasonForm participant={participant} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default HostContextActions;
