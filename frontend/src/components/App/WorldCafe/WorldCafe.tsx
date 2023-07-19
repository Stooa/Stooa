/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { WorldCafeStatus } from '@/jitsi/Status';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import Header from './Header/Header';
import { Main } from '@/layouts/App/styles';
import PreWorldCafe from './PreWorldCafe/PreWorldCafe';
import { useJitsi } from '@/lib/useJitsi';
import Loader from '@/components/Web/Loader';
import { ActiveWorldCafe } from './ActiveWorldCafe';
import useEventListener from '@/hooks/useEventListener';
import { CONNECTION_ESTABLISHED_FINISHED } from '@/jitsi/Events';
import { useConference } from '@/jitsi';

const WorldCafe = () => {
  const { status, isModerator, isPrejoin, isReady } = useWorldCafeStore();
  const [initConnection, setInitConnection] = useState(false);
  const { initialInteraction, initializeConnection } = useJitsi();
  const { wid } = useRouter().query;
  const { joinConference } = useConference();
  const isPreEvent = status === WorldCafeStatus.NOT_STARTED || status === undefined;

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    joinConference();
  });

  useEffect(() => {
    const started =
      status === WorldCafeStatus.RUNNING ||
      status === WorldCafeStatus.INTRODUCTION ||
      status === WorldCafeStatus.CONCLUSION;

    if (!isPrejoin && !initConnection && started) {
      setTimeout(() => {
        initializeConnection(wid, isModerator);
      }, 700);

      window.addEventListener('mousedown', initialInteraction);
      window.addEventListener('keydown', initialInteraction);

      setInitConnection(true);
    }

    return () => {
      window.removeEventListener('mousedown', initialInteraction);
      window.removeEventListener('keydown', initialInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isPrejoin, isModerator]);

  if (!status) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <Main>{isPreEvent ? <PreWorldCafe /> : <ActiveWorldCafe />}</Main>
    </>
  );
};

export default WorldCafe;
