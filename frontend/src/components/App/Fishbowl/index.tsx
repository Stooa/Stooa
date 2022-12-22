/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useSound from 'use-sound';

import { CONFERENCE_START, SCREEN_SHARE_PERMISSIONS_DENIED } from '@/jitsi/Events';
import useEventListener from '@/hooks/useEventListener';
import { useStooa } from '@/contexts/StooaManager';

import { Main } from '@/layouts/App/styles';
import ModalPermissions from '@/components/App/ModalPermissions';
import { useDevices } from '@/contexts/DevicesContext';
import ModalKickUser from '@/components/App/ModalKickUser';
import ReactionsReceiver from '@/components/App/Reactions/ReactionsReceiver';
import { pushEventDataLayer } from '@/lib/analytics';
import { useRouter } from 'next/router';
import OnBoardingTour from '@/components/App/OnBoardingTour';
import { useStateValue } from '@/contexts/AppContext';
import { IConferenceStatus } from '@/jitsi/Status';
import PreFishbowl from '@/components/App/PreFishbowl';
import ModalOnboarding from '@/components/App/ModalOnBoarding';
import { HackLeaveHover } from './styles';
import { isTimeLessThanNMinutes } from '@/lib/helpers';
import ModalConfirmLeaving from '../ModalConfirmLeaving';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { BREAKPOINTS } from '@/ui/settings';
import { useModals } from '@/contexts/ModalsContext';
import ModalScreenSharePermissions from '../ModalScreenSharePermissions';

const Header = dynamic(import('../Header'), { loading: () => <div /> });
const Footer = dynamic(import('../Footer'), { loading: () => <div /> });
const Seats = dynamic(import('../Seats'), { loading: () => <div /> });

const Fishbowl: FC = () => {
  const [play] = useSound(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/sounds/ding.mp3`);
  const { data, isModerator, participantToKick, setParticipantToKick } = useStooa();

  const {
    showOnBoardingModal,
    showConfirmCloseTabModal,
    setShowConfirmCloseTabModal,
    showScreenSharePermissions,
    setShowScreenSharePermissions
  } = useModals();

  const { width } = useWindowSize();

  const [participantsActive, setParticipantsActive] = useState(
    () => (isModerator && data.isFishbowlNow) || false
  );
  const [{ conferenceStatus }] = useStateValue();
  const { showModalPermissions, setShowModalPermissions } = useDevices();

  const { fid } = useRouter().query;

  const isPreFishbowl =
    conferenceStatus === IConferenceStatus.NOT_STARTED && (!data.isFishbowlNow || !isModerator);

  useEventListener(CONFERENCE_START, () => {
    if (!isModerator) play();
  });

  useEventListener(SCREEN_SHARE_PERMISSIONS_DENIED, () => {
    setShowScreenSharePermissions(true);
  });

  const toggleParticipants = () => {
    setParticipantsActive(!participantsActive);
  };

  const handleCloseModalPermissions = () => {
    setShowModalPermissions(false);
  };

  const handleModeratorIsGonnaLeave = () => {
    if (
      isModerator &&
      conferenceStatus === IConferenceStatus.RUNNING &&
      isTimeLessThanNMinutes(data.endDateTimeTz, 5)
    ) {
      setShowConfirmCloseTabModal(true);
    }
  };

  useEffect(() => {
    pushEventDataLayer({
      action: fid as string,
      category: 'FishbowlReactions',
      label: 'Connect'
    });

    if (width && width < BREAKPOINTS.tablet) {
      setParticipantsActive(false);
    }
  }, []);

  useEffect(() => {
    if (width && width < BREAKPOINTS.tablet) {
      setParticipantsActive(false);
    }
  }, [width]);

  return (
    <>
      <Header
        isPrefishbowl={isPreFishbowl}
        participantsActive={participantsActive}
        toggleParticipants={toggleParticipants}
      />
      <Main className={participantsActive ? 'drawer-open' : ''}>
        <HackLeaveHover onMouseEnter={handleModeratorIsGonnaLeave} />

        {/* MODALS */}
        {showConfirmCloseTabModal && (
          <ModalConfirmLeaving
            handleFinished={() => setShowConfirmCloseTabModal(false)}
            closeModal={() => setShowConfirmCloseTabModal(false)}
          />
        )}
        {showModalPermissions && <ModalPermissions closeModal={handleCloseModalPermissions} />}
        {participantToKick && (
          <ModalKickUser
            participant={participantToKick}
            onSubmit={() => setParticipantToKick(undefined)}
            closeModal={() => setParticipantToKick(undefined)}
          />
        )}
        {showOnBoardingModal && <ModalOnboarding />}

        {showScreenSharePermissions && (
          <ModalScreenSharePermissions closeModal={() => setShowScreenSharePermissions(false)} />
        )}

        {isPreFishbowl ? <PreFishbowl /> : <Seats />}
        <ReactionsReceiver className={participantsActive ? 'drawer-open' : ''} />
      </Main>
      {!isPreFishbowl && <Footer participantsActive={participantsActive} />}
      <OnBoardingTour />
    </>
  );
};

export default Fishbowl;
