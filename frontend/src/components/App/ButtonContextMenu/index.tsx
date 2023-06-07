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
import { useEffect, useRef, useState, useCallback } from 'react';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import { Participant } from '@/types/participant';
import ButtonKickUser from '../ButtonKickUser';
import useEventListener from '@/hooks/useEventListener';
import { IConferenceStatus } from '@/jitsi/Status';
import { SEATS_CHANGE } from '@/jitsi/Events';
import { useConference } from '@/jitsi';
import JitsiParticipant from 'lib-jitsi-meet/types/hand-crafted/JitsiParticipant';

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
  // TODO: This type is not clear. JitsiParticipant is inferred from jitsilib
  const [participant, setParticipant] = useState<Participant | JitsiParticipant | undefined>(
    initialParticipant
  );
  const { setParticipantToKick, conferenceReady, isModerator } = useStooa();
  const [{ fishbowlReady, conferenceStatus }] = useStateValue();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { getParticipantById } = useConference();

  const isMyself = initialParticipant ? initialParticipant.isCurrentUser : false;

  const showKickButton = useCallback(() => {
    return (
      (participant || initialParticipant) &&
      isModerator &&
      fishbowlReady &&
      !isMyself &&
      conferenceStatus === IConferenceStatus.RUNNING
    );
  }, [participant, initialParticipant, isModerator, fishbowlReady, conferenceStatus, isMyself]);

  useEventListener(SEATS_CHANGE, ({ detail: { seatsValues } }: SeatsChangeEventProps) => {
    if (seatNumber) {
      const participantId = seatsValues[seatNumber - 1];

      if (participantId) {
        setParticipant(getParticipantById(participantId));
      } else {
        setParticipant(undefined);
      }
    }
  });

  useEffect(() => {
    if (initialParticipant && conferenceReady) {
      setParticipant(getParticipantById(initialParticipant.id));
    }
  }, [conferenceReady, initialParticipant]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (showContextMenu && wrapperRef.current && !wrapperRef.current.contains(target)) {
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
      <StyledButtonContext data-testid="wrapper-context-menu" ref={wrapperRef}>
        <StyledButton
          data-testid="button-context-menu"
          className={className}
          onClick={() => setShowContextMenu(true)}
        >
          <DotsSvg />
        </StyledButton>
        {showContextMenu && (
          <StyledContextMenu
            data-testid="context-menu"
            id="context-menu"
            onMouseLeave={() => setShowContextMenu(false)}
          >
            <li>
              <ButtonKickUser
                data-testid="kick-button"
                onClick={() => setParticipantToKick(participant as Participant)}
              />
            </li>
          </StyledContextMenu>
        )}
      </StyledButtonContext>
    );
  }
};

export default ButtonContextMenu;
