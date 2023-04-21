/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

import { useStooa } from '@/contexts/StooaManager';
import { Header as HeaderStyled } from '@/layouts/App/styles';
import { ROUTE_HOME } from '@/app.config';
import StatusRecording from '../StatusRecording';
import RedRec from '@/ui/svg/rec-red.svg';
import TranscriptionSVG from '@/ui/svg/transcription-icon.svg';
import useTranslation from 'next-translate/useTranslation';

const Logo = dynamic(import('@/components/Common/Logo'), { loading: () => <div /> });
const StatusBar = dynamic(import('@/components/App/StatusBar'), { loading: () => <div /> });
const ModeratorActions = dynamic(import('@/components/App/ModeratorActions'), {
  loading: () => <div />
});
const Participants = dynamic(import('@/components/App/Participants'), { loading: () => <div /> });
const FishbowlInfo = dynamic(import('@/components/App/FishbowlInfo'), { loading: () => <div /> });
const OnBoardingButton = dynamic(import('@/components/App/OnBoarding'), {
  loading: () => <div />
});

interface Props {
  isPrefishbowl?: boolean;
}

const Header: React.FC<Props> = ({ isPrefishbowl }) => {
  const {
    data,
    isModerator,
    conferenceStatus,
    conferenceReady,
    isRecording,
    isTranscriptionEnabled
  } = useStooa();
  const router = useRouter();
  const { fid } = router.query;
  const { t } = useTranslation('fishbowl');

  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) {
      if (!isModerator && isRecording) {
        toast(t('recording.participantNotificationStart'), {
          icon: <RedRec />,
          type: 'info',
          autoClose: 5000,
          position: 'bottom-center'
        });
      } else if (!isModerator && !isRecording) {
        toast(t('recording.participantNotificationStop'), {
          icon: 'ℹ️',
          type: 'info',
          autoClose: 5000,
          position: 'bottom-center'
        });
      }
    } else {
      notInitialRender.current = true;
    }
  }, [isRecording]);

  return (
    <HeaderStyled className={`${isPrefishbowl ? 'prefishbowl' : ''}`}>
      {!isPrefishbowl && (
        <div className="hide-desktop header-top">
          <Logo className="header-logo" />
          <div className="mobile-status">
            <StatusRecording showAnimation={isRecording} />
            <StatusBar />
          </div>
        </div>
      )}
      <div className="header-info">
        {isPrefishbowl ? (
          <Logo href={ROUTE_HOME} className="header-logo" />
        ) : (
          <>
            <FishbowlInfo data={data} />
            <OnBoardingButton />
          </>
        )}
      </div>
      <StatusRecording className="hide-mobile" showAnimation={isRecording} />
      <div className="header-actions">
        {isModerator && (
          <div className={!isPrefishbowl ? 'hide-mobile' : ''}>
            <ModeratorActions fid={fid as string} conferenceStatus={conferenceStatus} />
          </div>
        )}
        {!isPrefishbowl && (
          <>
            <div className="hide-mobile">
              <StatusBar />
            </div>
            <Participants initialized={conferenceReady} fid={fid as string} />
            {isTranscriptionEnabled && (
              <div className="transcription-indicator">
                <TranscriptionSVG />
              </div>
            )}
          </>
        )}
      </div>
    </HeaderStyled>
  );
};

export default Header;
