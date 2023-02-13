/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import { IConferenceStatus } from '@/jitsi/Status';
import { useStateValue } from '@/contexts/AppContext';
import { useStooa } from '@/contexts/StooaManager';
import VideoPlaceholder from '@/components/App/VideoPlaceholder';
import SeatsStyled, { Free, Seat, VideoWrapper } from '@/components/App/Seats/styles';
import SeatImage from '@/ui/svg/seat.svg';
import Fullscreen from '@/ui/svg/fullscreen.svg';
import NotAvailableImage from '@/ui/svg/unavailable-seat.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import ButtonContextMenu from '../ButtonContextMenu';
import { join, leave } from '@/lib/jitsi';
import userRepository from '@/jitsi/User';
import LoadingIcon from '@/components/Common/LoadingIcon';
import Button from '@/components/Common/Button';
import { useState } from 'react';

const Seats = () => {
  const { t } = useTranslation('app');
  const { isSharing, isModerator } = useStooa();
  const [{ conferenceStatus }] = useStateValue();
  const [joined, setJoined] = useState<boolean>(false);
  const [participantSeat, setParticipantSeat] = useState<number | undefined>(undefined);

  const isConferenceInIntro = conferenceStatus === IConferenceStatus.INTRODUCTION;
  const isConferenceNotStarted = conferenceStatus === IConferenceStatus.NOT_STARTED;
  const isConferenceRunning = conferenceStatus === IConferenceStatus.RUNNING;

  const joinSeat = async (seat: number): Promise<void> => {
    if (!joined) {
      await join(userRepository.getUser(), seat);

      setTimeout(() => {
        setJoined(true);
        setParticipantSeat(seat);
      }, 500);
    }
  };

  const leaveSeat = async (): Promise<void> => {
    if (joined) {
      await leave();

      setTimeout(() => {
        setJoined(false);
        setParticipantSeat(undefined);
      }, 500);
    }
  };

  const handleFullscreen = () => {
    const video = document.querySelector('#share video') as HTMLVideoElement;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else {
        // @ts-expect-error for safari
        video.webkitRequestFullscreen();
      }
    }
  };

  const showLeaveButton = (seat: number): boolean => {
    return joined && participantSeat === seat;
  };

  return (
    <SeatsStyled>
      <div
        id="seats-content"
        data-testid="seats-wrapper"
        className={`content seats-wrapper ${isSharing ? 'sharing' : ''} ${
          isConferenceNotStarted ? 'not-started' : ''
        } `}
      >
        <div id="share">
          <LoadingIcon white />
          <div className={`share-video-wrapper ${isModerator ? 'moderator' : ''}`}>
            <button className="fullscreen" onClick={handleFullscreen}>
              <Fullscreen />
            </button>
            {isModerator && <p className="warning medium">{t('shareWarning')}</p>}
          </div>
        </div>

        {[...Array(5)].map((e, seat) => (
          <Seat data-testid="seat" key={`seat-${seat + 1}`} id={`seat-${seat + 1}`}>
            {isConferenceRunning && !joined && (
              <Button className="body-sm" onClick={() => joinSeat(seat + 1)}>
                Join
              </Button>
            )}
            {isConferenceRunning && showLeaveButton(seat + 1) && (
              <Button style={{ zIndex: 999999 }} className="body-sm" onClick={() => leaveSeat()}>
                Leave
              </Button>
            )}
            <ButtonContextMenu seatNumber={seat + 1} className="context-button" />
            <div className="frame" />
            <MicMuted className="icon-medium icon-audio" />
            <VideoMuted className="icon-medium icon-video" />
            <Free className="seat-wrapper">
              {isConferenceInIntro || isConferenceNotStarted ? (
                <>
                  <NotAvailableImage />
                  {isConferenceInIntro ? (
                    <span className="text body-sm">{t('seatAvailableAfterIntro')}</span>
                  ) : (
                    <span data-testid="unavailable-seat" className="text body-sm">
                      {t('seatUnavailable')}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <SeatImage />
                  <span data-testid="available-seat" className="text body-sm">
                    {t('seatAvailable')}
                  </span>
                </>
              )}
            </Free>
            <VideoPlaceholder className="video-placeholder" />
            <VideoWrapper className="video-wrapper" />
          </Seat>
        ))}
      </div>
    </SeatsStyled>
  );
};

export default Seats;
