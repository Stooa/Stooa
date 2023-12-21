/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { ROUTE_HOME, ROUTE_NOT_FOUND } from '@/app.config';
import { GET_FISHBOWL } from '@/lib/gql/Fishbowl';
import withIsFishbowlEnded from '@/hocs/withIsFishbowlEnded';
import { useStateValue } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

import useTranslation from 'next-translate/useTranslation';
import { IConferenceStatus } from '@/jitsi/Status';
import { createApolloClient } from '@/lib/apollo-client';
import { Fishbowl as FishbowlType } from '@/types/api-platform';

import Fishbowl from '@/components/App/Fishbowl';
import JoinFishbowl from '@/components/Web/JoinFishbowl';
import Layout from '@/layouts/App';

const LayoutWeb = dynamic(import('@/layouts/FishbowlDetail'), { loading: () => <div /> });
const FishbowlLanding = dynamic(import('@/components/Web/FishbowlLanding'), {
  loading: () => <div />
});
const FishbowlPreJoin = dynamic(import('@/components/App/FishbowlPreJoin'), {
  loading: () => <div />
});

const Page = ({ fishbowl }: { fishbowl: FishbowlType }) => {
  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const router = useRouter();
  const { lang } = useTranslation();

  const [{ fishbowlReady, isGuest, prejoin, conferenceStatus }] = useStateValue();
  const { isAuthenticated } = useAuth();

  const handleJoinAsGuest = (): void => {
    setJoinAsGuest(true);
  };

  const shouldPrintPreJoinPage: boolean =
    (joinAsGuest || isAuthenticated) && prejoin && fishbowlReady;
  const shouldPrintFishbowlPage: boolean = fishbowlReady && (isAuthenticated || isGuest);

  useEffect(() => {
    router.beforePopState(({ as }): boolean => {
      if (as === '/fishbowl/host-now' || as.includes('/fishbowl/detail')) {
        router.replace(ROUTE_HOME, ROUTE_HOME, { locale: lang });
        return false;
      }
      return true;
    });

    if (!fishbowl) {
      router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
    }

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fishbowl) {
    return null;
  }

  return shouldPrintPreJoinPage || shouldPrintFishbowlPage ? (
    <Layout
      className={conferenceStatus === IConferenceStatus.NOT_STARTED ? 'prefishbowl' : ''}
      fishbowl={fishbowl}
      prejoin={shouldPrintPreJoinPage}
    >
      {shouldPrintPreJoinPage ? <FishbowlPreJoin /> : <Fishbowl />}
    </Layout>
  ) : (
    <LayoutWeb>
      <FishbowlLanding data={fishbowl} />
      <JoinFishbowl data={fishbowl} joinAsGuest={handleJoinAsGuest} />
    </LayoutWeb>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const fid = params ? params.fid : '';
  const apolloClient = createApolloClient();

  const { data } = await apolloClient
    .query({
      query: GET_FISHBOWL,
      variables: { slug: fid as string }
    })
    .catch(error => {
      console.log(error);
      return { data: null };
    });

  if (!data) {
    return {
      props: {}
    };
  }

  const { bySlugQueryFishbowl: fishbowl } = data;
  const SEODescription = fishbowl.description !== '' ? fishbowl.description : null;
  const seoTitle = fishbowl.isPrivate ? `🔒 ${fishbowl.name}` : fishbowl.name;

  return {
    props: {
      seoTitle,
      seoDescription: SEODescription,
      fishbowl
    }
  };
};

export default withIsFishbowlEnded(Page);
