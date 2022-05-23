/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FC, useState } from 'react';
import dynamic from 'next/dynamic';
import useSound from 'use-sound';

import { CONFERENCE_START } from '@/jitsi/Events';
import useEventListener from '@/hooks/useEventListener';
import { useStooa } from '@/contexts/StooaManager';

import { Main } from '@/layouts/App/styles';
import ModalPermissions from '../ModalPermissions';
import { useDevices } from '@/contexts/DevicesContext';

const Header = dynamic(import('../Header'), { loading: () => <div /> });
const Footer = dynamic(import('../Footer'), { loading: () => <div /> });
const Seats = dynamic(import('../Seats'), { loading: () => <div /> });

const Fishbowl: FC = () => {
  const [participantsActive, setParticipantsActive] = useState(false);
  const [play] = useSound(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/sounds/ding.mp3`);
  const { isModerator } = useStooa();
  const { showModalPermissions, setShowModalPermissions } = useDevices();

  useEventListener(CONFERENCE_START, () => {
    if (!isModerator) play();
  });

  const toggleParticipants = () => {
    setParticipantsActive(!participantsActive);
  };

  const handleCloseModalPermissions = () => {
    setShowModalPermissions(false);
  };

  return (
    <>
      <Header toggleParticipants={toggleParticipants} />
      <Main className={participantsActive ? 'drawer-open' : ''}>
        {showModalPermissions && <ModalPermissions closeModal={handleCloseModalPermissions} />}
        <Seats />
      </Main>
      <Footer participantsActive={participantsActive} />
    </>
  );
};

export default Fishbowl;
