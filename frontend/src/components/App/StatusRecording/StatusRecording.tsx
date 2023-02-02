/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import { StyledRecordingStatus } from './styles';
import StopRec from '@/ui/svg/stop-record.svg';
import RedRec from '@/ui/svg/rec-red.svg';
import { useStooa } from '@/contexts/StooaManager';
import RecordingTimer from '@/components/App/RecordingTimer';
import LoadingDots from '@/components/Common/LoadingDots';
import { useState } from 'react';
import Tooltip from '@/components/Common/Tooltip';
import { useModals } from '@/contexts/ModalsContext';

const StatusRecording = () => {
  const { t } = useTranslation('fishbowl');
  const { isModerator } = useStooa();
  const [showTooltip, setShowTooltip] = useState(false);
  const { setShowStopRecording } = useModals();

  return (
    <StyledRecordingStatus className={`body-xs medium ${isModerator ? 'moderator' : ''}`}>
      {isModerator ? (
        <>
          {t('recording.status')}
          <LoadingDots />
          <RecordingTimer />
          <button
            onClick={() => setShowStopRecording(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <StopRec className="stop" />
            <Tooltip arrow showTooltip={showTooltip} position="bottom">
              {t('recording.stop')}
            </Tooltip>
          </button>
        </>
      ) : (
        <>
          <RedRec className="red-dot" />
          {t('recording.status')}
        </>
      )}
    </StyledRecordingStatus>
  );
};

export default StatusRecording;
