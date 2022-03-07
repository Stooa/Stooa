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

const Seats = () => {
  const { t } = useTranslation('app');
  const [{ conferenceStatus }] = useStateValue();

  const isIntro = conferenceStatus === IConferenceStatus.INTRODUCTION;
  const notStarted = conferenceStatus === IConferenceStatus.NOT_STARTED;

  return (
    <SeatsStyled>
      <div className="content">
        {[...Array(5)].map((e, seat) => (
          <Seat
            className={notStarted ? 'not-started' : ''}
            key={`seat-${seat + 1}`}
            id={`seat-${seat + 1}`}
          >
            <div className="frame" />
            <MicMuted className="icon-medium icon-audio" />
            <VideoMuted className="icon-medium icon-video" />
            <Free>
              {isIntro ? (
                <>
                  <NotAvailableImage />
                  <span className="text app-md">{t('seatAvailableAfterIntro')}</span>
                </>
              ) : (
                <>
                  <SeatImage />
                  <span className="text app-md">{t('seatAvailable')}</span>
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
