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
import NotAvailableImage from '@/ui/svg/unavailable-seat.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import ButtonContextMenu from '../ButtonContextMenu';

const Seats = () => {
  const { t } = useTranslation('app');
  const { isSharing, isModerator } = useStooa();
  const [{ conferenceStatus }] = useStateValue();

  const isConferenceInIntro = conferenceStatus === IConferenceStatus.INTRODUCTION;
  const isConferenceNotStarted = conferenceStatus === IConferenceStatus.NOT_STARTED;

  return (
    <SeatsStyled>
      <div
        data-testid="seats-wrapper"
        className={`content seats-wrapper ${isSharing ? 'sharing' : ''} ${
          isConferenceNotStarted ? 'not-started' : ''
        } `}
      >
        <div id="share">
          <div className={`share-video-wrapper ${isModerator ? 'moderator' : ''}`}></div>
          {isModerator && (
            <p className="warning medium">
              Para evitar el efecto espejo infinito, no compartas la pantalla completa ni la ventana
              del navegador entera. Comparte una sola pestaña o una ventana diferente.
            </p>
          )}
        </div>

        {[...Array(5)].map((e, seat) => (
          <Seat data-testid="seat" key={`seat-${seat + 1}`} id={`seat-${seat + 1}`}>
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
