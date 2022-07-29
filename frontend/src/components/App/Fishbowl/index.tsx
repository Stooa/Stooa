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

import { CONFERENCE_START } from '@/jitsi/Events';
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

const Header = dynamic(import('../Header'), { loading: () => <div /> });
const Footer = dynamic(import('../Footer'), { loading: () => <div /> });
const Seats = dynamic(import('../Seats'), { loading: () => <div /> });

const Fishbowl: FC = () => {
  const [participantsActive, setParticipantsActive] = useState(false);
  const [play] = useSound(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/sounds/ding.mp3`);
  const { isModerator, participantToKick, setParticipantToKick, showOnBoardingModal } = useStooa();
  const [{ fishbowlReady, conferenceStatus }] = useStateValue();
  const { showModalPermissions, setShowModalPermissions } = useDevices();

  const { fid } = useRouter().query;

  const isPreFishbowl = fishbowlReady && conferenceStatus === IConferenceStatus.NOT_STARTED;

  useEventListener(CONFERENCE_START, () => {
    if (!isModerator) play();
  });

  const toggleParticipants = () => {
    setParticipantsActive(!participantsActive);
  };

  const handleCloseModalPermissions = () => {
    setShowModalPermissions(false);
  };

  useEffect(() => {
    pushEventDataLayer({
      action: fid as string,
      category: 'FishbowlReactions',
      label: 'Connect'
    });
  }, []);

  return (
    <>
      <Header isPrefishbowl={isPreFishbowl} toggleParticipants={toggleParticipants} />
      <Main className={participantsActive ? 'drawer-open' : ''}>
        {/* MODALS */}
        {showModalPermissions && <ModalPermissions closeModal={handleCloseModalPermissions} />}
        {participantToKick && (
          <ModalKickUser
            participant={participantToKick}
            onSubmit={() => setParticipantToKick(null)}
            closeModal={() => setParticipantToKick(null)}
          />
        )}
        {showOnBoardingModal && <ModalOnboarding />}

        {isPreFishbowl ? <PreFishbowl /> : <Seats />}
        <ReactionsReceiver className={participantsActive ? 'drawer-open' : ''} />
      </Main>
      {!isPreFishbowl && <Footer participantsActive={participantsActive} />}
      <OnBoardingTour />
    </>
  );
};

export default Fishbowl;
