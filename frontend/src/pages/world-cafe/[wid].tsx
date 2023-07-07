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
import { PrejoinWorldCafeForm } from '@/components/App/EventPrejoin/PrejoinWorldCafeForm';

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
  // const shouldPrintFishbowlPage: boolean = isReady && (isAuthenticated || isGuest);

  if (shouldPrintPreJoinPage && worldCafe) {
    return (
      <WorldCafeApp
        wid={wid as string}
        className={status === WorldCafeStatus.NOT_STARTED ? 'prefishbowl' : ''}
        prejoin={shouldPrintPreJoinPage}
        title={worldCafe.name}
      >
        <EventPrejoin event="worldCafe">
          <PrejoinWorldCafeForm />
        </EventPrejoin>
      </WorldCafeApp>
    );
  } else {
    return (
      <LayoutWeb>
        <WorldCafeLanding />
        <JoinEvent joinAsGuest={() => setJoinAsGuest(true)} />
      </LayoutWeb>
    );
  }
};

export default Page;
