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
import useWorldCafeLoader from '@/hooks/useWorldCafeLoader';
import { useRouter } from 'next/router';
import Loader from '@/components/Web/Loader';
import JoinEvent from '@/components/Web/JoinEvent';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { WorldCafeStatus } from '@/jitsi/Status';
import EventPrejoin from '@/components/App/EventPrejoin';
import { PrejoinWorldCafeForm } from '@/components/App/EventPrejoin/PrejoinWorldCafeForm';
import WorldCafe from '@/components/App/WorldCafe/WorldCafe';
import api from '@/lib/api';
import useTranslation from 'next-translate/useTranslation';

const LayoutWeb = dynamic(import('@/layouts/EventDetail'), { loading: () => <div /> });
const WorldCafeApp = dynamic(import('@/layouts/WorldCafeApp/WorldCafeApp'), {
  loading: () => <div />
});

const Page = () => {
  const {
    query: { wid }
  } = useRouter();

  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const { lang } = useTranslation();
  const apiInterval = useRef<number>();

  const { isAuthenticated } = useAuth();

  const { loading, error } = useWorldCafeLoader(wid as string);
  const { isReady, isGuest, prejoin, status, worldCafe, setStatus } = useWorldCafeStore(store => ({
    worldCafe: store.worldCafe,
    isReady: store.isReady,
    prejoin: store.isPrejoin,
    status: store.status,
    setStatus: store.setStatus,
    isGuest: store.isGuest
  }));

  const checkApIConferenceStatus = () => {
    api
      .get(`${lang}/world-cafe-status/${wid}`, {
        headers: { 'Accept-Language': lang }
      })
      .then(({ data: { status } }) => {
        setStatus(status);
      })
      .catch(error => {
        console.log('[STOOA] ', error);
      });
  };

  useEffect(() => {
    apiInterval.current = window.setInterval(checkApIConferenceStatus, 6000);

    return () => {
      clearInterval(apiInterval.current);
    };
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  const shouldPrintPreJoinPage: boolean = (joinAsGuest || isAuthenticated) && prejoin && isReady;
  const shouldPrintWorldCafeApp: boolean = isReady && (isAuthenticated || isGuest);

  if (shouldPrintPreJoinPage || shouldPrintWorldCafeApp) {
    return (
      <WorldCafeApp
        wid={wid as string}
        className={status === WorldCafeStatus.NOT_STARTED ? 'prefishbowl' : ''}
        prejoin={shouldPrintPreJoinPage}
        title={worldCafe?.name ?? ''}
      >
        {shouldPrintPreJoinPage ? (
          <EventPrejoin event="worldCafe">
            <PrejoinWorldCafeForm />
          </EventPrejoin>
        ) : (
          <WorldCafe />
        )}
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
