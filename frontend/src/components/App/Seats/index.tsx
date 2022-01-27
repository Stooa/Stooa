/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import VideoPlaceholder from '@/components/App/VideoPlaceholder';
import SeatImage from '@/ui/svg/seat.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import SeatsStyled, { Free, Seat } from '@/components/App/Seats/styles';

const Seats = () => {
  const { t } = useTranslation('app');

  return (
    <SeatsStyled>
      <div className="content">
        {[...Array(5)].map((e, seat) => (
          <Seat key={`seat-${seat + 1}`} id={`seat-${seat + 1}`}>
            <div className="frame" />
            <MicMuted className="icon-medium icon-audio" />
            <VideoMuted className="icon-medium icon-video" />
            <Free>
              <SeatImage />
              <span className="text app-sm">{t('seatAvailable')}</span>
            </Free>
            <VideoPlaceholder className="video-placeholder" />
          </Seat>
        ))}
      </div>
    </SeatsStyled>
  );
};

export default Seats;
