/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSound from 'use-sound';

import { CONFERENCE_START } from '@/jitsi/Events';
import useEventListener from '@/hooks/useEventListener';
import { useStooa } from '@/contexts/StooaManager';

import { Main } from '@/layouts/App/styles';

const Header = dynamic(import('../Header'), { loading: () => <div /> });
const Footer = dynamic(import('../Footer'), { loading: () => <div /> });
const Seats = dynamic(import('../Seats'), { loading: () => <div /> });

const Fishbowl = () => {
  const [participantsActive, setParticipantsActive] = useState(false);
  const [play] = useSound(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/sounds/ding.mp3`);
  const { isModerator } = useStooa();

  useEventListener(CONFERENCE_START, () => {
    if (!isModerator) play();
  });

  const toggleParticipants = () => {
    setParticipantsActive(!participantsActive);
  };

  return (
    <>
      <Header toggleParticipants={toggleParticipants} />
      <Main className={participantsActive ? 'drawer-open' : ''}>
        <Seats />
      </Main>
      <Footer participantsActive={participantsActive} />
    </>
  );
};

export default Fishbowl;
