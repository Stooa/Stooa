/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledContextButton, StyledContextMenu, StyledContextWrapper } from './styles';
import DotsSvg from '@/ui/svg/dots.svg';
import { useEffect, useRef, useState } from 'react';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import { Participant } from '@/types/participant';
import ButtonKickUser from '../ButtonKickUser';
import useEventListener from '@/hooks/useEventListener';
import { IConferenceStatus } from '@/jitsi/Status';
import { SEATS_CHANGE } from '@/jitsi/Events';
import conferenceRepository from '@/jitsi/Conference';
import ModalKickUser from '../ModalKickUser';
import KickReasonForm from '../KickReasonForm';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  className?: string;
  initialParticipant?: Participant;
  seatNumber?: number;
}

type SeatsChangeEventProps = {
  detail: {
    seats: [];
    seatsValues: [];
  };
};

const ButtonContextMenu = ({ className, initialParticipant, seatNumber }: Props) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showKickReasonsModal, setShowKickReasonsModal] = useState(false);
  const [participant, setParticipant] = useState<Participant>(initialParticipant);

  const wrapperRef = useRef(null);

  const { isModerator } = useStooa();
  const [{ fishbowlReady, conferenceStatus }] = useStateValue();
  const { t } = useTranslation('fishbowl');

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

  const getParticipantName = (): string => {
    return participant ? participant.getDisplayName() : '';
  };

  useEventListener(SEATS_CHANGE, ({ detail: { seatsValues } }: SeatsChangeEventProps) => {
    const participantId = seatsValues[seatNumber - 1];

    if (participantId) {
      setParticipant(conferenceRepository.getParticipantById(participantId));
    }
  });

  // useEffect(() => {
  //   if (initialParticipant) {
  //     setParticipant(conferenceRepository.getParticipantById(initialParticipant.id));
  //   }
  // }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showContextMenu && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  if (!showKickButton()) {
    return null;
  } else {
    return (
      <StyledContextWrapper ref={wrapperRef}>
        <StyledContextButton className={className} onClick={() => setShowContextMenu(true)}>
          <DotsSvg />
        </StyledContextButton>
        {showContextMenu && (
          <StyledContextMenu id="context-menu" onMouseLeave={() => setShowContextMenu(false)}>
            <li>
              <ButtonKickUser onClick={() => setShowKickReasonsModal(true)} />
            </li>
          </StyledContextMenu>
        )}

        {showKickReasonsModal && (
          <ModalKickUser closeModal={() => setShowKickReasonsModal(false)}>
            <h2 className="title-sm">
              {t('kick.modal.title', {
                userName: getParticipantName()
              })}
            </h2>
            <p className="body-xs subtitle">
              <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
            </p>
            <KickReasonForm
              participant={participant}
              onSubmit={() => setShowKickReasonsModal(false)}
            />
          </ModalKickUser>
        )}
      </StyledContextWrapper>
    );
  }
};

export default ButtonContextMenu;
