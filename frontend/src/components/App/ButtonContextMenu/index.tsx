/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledContextMenu, StyledButtonContext, StyledButton } from './styles';
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
  const [participant, setParticipant] = useState<Participant>(initialParticipant);
  const { setParticipantToKick, conferenceReady } = useStooa();

  const wrapperRef = useRef(null);

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

  useEventListener(SEATS_CHANGE, ({ detail: { seatsValues } }: SeatsChangeEventProps) => {
    if (seatNumber) {
      const participantId = seatsValues[seatNumber - 1];

      if (participantId) {
        setParticipant(conferenceRepository.getParticipantById(participantId));
      } else {
        setParticipant(null);
      }
    }
  });

  useEffect(() => {
    if (initialParticipant && conferenceReady) {
      setParticipant(conferenceRepository.getParticipantById(initialParticipant.id));
    }
  }, [conferenceReady]);

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
      <StyledButtonContext ref={wrapperRef}>
        <StyledButton className={className} onClick={() => setShowContextMenu(true)}>
          <DotsSvg />
        </StyledButton>
        {showContextMenu && (
          <StyledContextMenu id="context-menu" onMouseLeave={() => setShowContextMenu(false)}>
            <li>
              <ButtonKickUser onClick={() => setParticipantToKick(participant)} />
            </li>
          </StyledContextMenu>
        )}
      </StyledButtonContext>
    );
  }
};

export default ButtonContextMenu;
