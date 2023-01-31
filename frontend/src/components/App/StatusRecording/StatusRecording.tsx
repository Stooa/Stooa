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
import RedRec from '@/ui/svg/red-rec-status.svg';
import { useStooa } from '@/contexts/StooaManager';

const StatusRecording = () => {
  const { t } = useTranslation('fishbowl');
  const { isModerator } = useStooa();

  return (
    <StyledRecordingStatus className={`body-xs medium ${isModerator ? 'moderator' : ''}`}>
      {isModerator ? (
        <>
          {t('recording.status')}
          <StopRec className="stop" />
        </>
      ) : (
        <>
          <RedRec />
          {t('recording.status')}
        </>
      )}
    </StyledRecordingStatus>
  );
};

export default StatusRecording;
