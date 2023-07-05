/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dynamic from 'next/dynamic';

import WorldCafeLanding from '@/components/Web/WorldCafeLanding';
// import WorldCafeApp from '@/layouts/WorldCafeApp/WorldCafeApp';
import useWorldCafeLoader from '@/hooks/useWorldCafeLoader';
import { useRouter } from 'next/router';
import Loader from '@/components/Web/Loader';
import JoinEvent from '@/components/Web/JoinEvent';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { WorldCafeStatus } from '@/jitsi/Status';
import EventPrejoin from '@/components/App/EventPrejoin';

const LayoutWeb = dynamic(import('@/layouts/EventDetail'), { loading: () => <div /> });
const WorldCafeApp = dynamic(import('@/layouts/WorldCafeApp/WorldCafeApp'), {
  loading: () => <div />
});

const Page = () => {
  const {
    query: { wid }
  } = useRouter();

  const [joinAsGuest, setJoinAsGuest] = useState(false);

  const { isAuthenticated } = useAuth();

  const { loading, error } = useWorldCafeLoader(wid as string);
  const { isReady, prejoin, status, worldCafe } = useWorldCafeStore(store => ({
    worldCafe: store.worldCafe,
    isReady: store.isReady,
    prejoin: store.isPrejoin,
    status: store.status
  }));

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  const shouldPrintPreJoinPage: boolean = (joinAsGuest || isAuthenticated) && prejoin && isReady;
  const shouldPrintFishbowlPage: boolean = isReady && (isAuthenticated || isGuest);

  console.table({
    joinAsGuest,
    isAuthenticated,
    prejoin,
    isReady
  });

  console.log(shouldPrintPreJoinPage);

  if (shouldPrintPreJoinPage && worldCafe) {
    return (
      <WorldCafeApp
        className={status === WorldCafeStatus.NOT_STARTED ? 'prefishbowl' : ''}
        prejoin={shouldPrintPreJoinPage}
        title={worldCafe.name}
      >
        <EventPrejoin>
          <h2>NOSEQUE VENGA</h2>
          <div>Formulario aqui nose que</div>
        </EventPrejoin>
      </WorldCafeApp>
    );
  } else {
    return (
      <LayoutWeb>
        <WorldCafeLanding />
        <JoinEvent />
      </LayoutWeb>
    );
  }
};

export default Page;
