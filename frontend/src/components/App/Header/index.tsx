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
import ModalShareLink from '@/components/App/ModalShareLink';
import { ROUTE_HOME } from '@/app.config';
import StatusRecording from '../StatusRecording';
import RedRec from '@/ui/svg/rec-red.svg';

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
  toggleParticipants: () => void;
  participantsActive: boolean;
  isPrefishbowl?: boolean;
}

const Header: React.FC<Props> = ({ toggleParticipants, participantsActive, isPrefishbowl }) => {
  const { data, isModerator, conferenceStatus, conferenceReady, isRecording } = useStooa();
  const router = useRouter();
  const { fid } = router.query;

  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) {
      if (!isModerator && isRecording) {
        toast('The host is recording', {
          icon: <RedRec />,
          type: 'info',
          autoClose: 5000,
          position: 'bottom-center'
        });
      } else if (!isModerator && !isRecording) {
        toast('The host stopped recording', {
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
      {isRecording && <StatusRecording />}
      {!isPrefishbowl && (
        <div className="hide-desktop header-top">
          <Logo className="header-logo" />
          <StatusBar />
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
      <div className="header-share">
        <ModalShareLink />
      </div>
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
            <Participants
              initialized={conferenceReady}
              opened={participantsActive}
              fid={fid as string}
              toggleParticipants={toggleParticipants}
            />
          </>
        )}
      </div>
    </HeaderStyled>
  );
};

export default Header;
