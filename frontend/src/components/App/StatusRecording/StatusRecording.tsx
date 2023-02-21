/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import { StyledRecordingStatus, StyledAnimatedStatusWrapper } from './styles';
import StopRec from '@/ui/svg/stop-record.svg';
import RedRec from '@/ui/svg/rec-red.svg';
import { useStooa } from '@/contexts/StooaManager';
import RecordingTimer from '@/components/App/RecordingTimer';
import { useModals } from '@/contexts/ModalsContext';

const StatusRecording = ({
  showAnimation,
  className = ''
}: {
  showAnimation: boolean;
  className?: string;
}) => {
  const { t } = useTranslation('fishbowl');
  const { isModerator } = useStooa();
  const { setShowStopRecording } = useModals();

  return (
    <StyledAnimatedStatusWrapper className={showAnimation ? 'show' : ''}>
      <StyledRecordingStatus
        className={`body-xs medium ${isModerator ? 'moderator' : ''}  ${className}`}
      >
        {isModerator ? (
          <>
            <button onClick={() => setShowStopRecording(true)}>
              <StopRec className="stop" />
              {t('recording.statusHost')}
              {showAnimation && <RecordingTimer />}
            </button>
          </>
        ) : (
          <>
            <RedRec className="red-dot" />
            {t('recording.status')}
          </>
        )}
      </StyledRecordingStatus>
    </StyledAnimatedStatusWrapper>
  );
};

export default StatusRecording;
