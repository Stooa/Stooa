/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { WorldCafeStatus } from '@/jitsi/Status';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';

import WorldCafeHeader from '../WorldCafeHeader/WorldCafeHeader';
import { Main } from '@/layouts/App/styles';
import PreWorldCafe from '../PreWorldCafe/PreWorldCafe';
import WorldCafeMainApp from '../WorldCafeMainApp/WorldCafeMainApp';
import { useJitsi } from '@/lib/useJitsi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const WorldCafe = () => {
  const { status, isModerator, isPrejoin } = useWorldCafeStore();
  const [initConnection, setInitConnection] = useState(false);
  const { initialInteraction, initializeConnection } = useJitsi();
  const { wid } = useRouter().query;

  const isPreevent = status === WorldCafeStatus.NOT_STARTED;

  useEffect(() => {
    if (!isPreevent && !initConnection && isModerator && status === WorldCafeStatus.INTRODUCTION) {
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

  return (
    <>
      <WorldCafeHeader />

      <Main>{isPreevent ? <PreWorldCafe /> : <WorldCafeMainApp />}</Main>
    </>
  );
};

export default WorldCafe;
