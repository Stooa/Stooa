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
import VideoPlaceholder from '@/components/App/VideoPlaceholder';
import SeatsStyled, { Free, Seat } from '@/components/App/Seats/styles';
import SeatImage from '@/ui/svg/seat.svg';
import NotAvailableImage from '@/ui/svg/unavailable-seat.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import ButtonKickUser from '@/components/App/ButtonKickUser';
import ContextMenu from '@/components/App/ContextMenu';

const Seats = () => {
  const { t } = useTranslation('app');
  const [{ conferenceStatus }] = useStateValue();

  const isConferenceInIntro = conferenceStatus === IConferenceStatus.INTRODUCTION;
  const isConferenceNotStarted = conferenceStatus === IConferenceStatus.NOT_STARTED;

  return (
    <SeatsStyled>
      <div className={`content ${isConferenceNotStarted ? 'not-started' : ''} `}>
        {[...Array(5)].map((e, seat) => (
          <Seat key={`seat-${seat + 1}`} id={`seat-${seat + 1}`}>
            <ContextMenu>
              <li>
                <ButtonKickUser seatNumber={seat} />
              </li>
            </ContextMenu>
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
                    <span className="text body-sm">{t('seatUnavailable')}</span>
                  )}
                </>
              ) : (
                <>
                  <SeatImage />
                  <span className="text body-sm">{t('seatAvailable')}</span>
                </>
              )}
            </Free>
            <VideoPlaceholder className="video-placeholder" />
          </Seat>
        ))}
      </div>
    </SeatsStyled>
  );
};

export default Seats;
