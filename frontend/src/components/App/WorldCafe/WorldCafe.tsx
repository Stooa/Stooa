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
import VideoGrid from './VideoGrid/VideoGrid';
import { useJitsi } from '@/lib/useJitsi';
import Loader from '@/components/Web/Loader';

const WorldCafe = () => {
  const { status, isModerator, isPrejoin, isReady } = useWorldCafeStore();
  const [initConnection, setInitConnection] = useState(false);
  const { initialInteraction, initializeConnection } = useJitsi();
  const { wid } = useRouter().query;

  const isPreEvent = status === WorldCafeStatus.NOT_STARTED || status === undefined;

  useEffect(() => {
    const started =
      status === WorldCafeStatus.RUNNING ||
      status === WorldCafeStatus.INTRODUCTION ||
      status === WorldCafeStatus.CONCLUSION;

    console.table({
      isPrejoin: !isPrejoin,
      initConnection: !initConnection
    });

    console.table({
      isModerator,
      started
    });

    console.table({
      isReady: !isReady,
      started
    });

    // Cuando seas host y NO ESTE inicializada enchufar

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
    <Loader />;
  }

  return (
    <>
      <Header />
      <Main>{isPreEvent ? <PreWorldCafe /> : <VideoGrid />}</Main>
    </>
  );
};

export default WorldCafe;
