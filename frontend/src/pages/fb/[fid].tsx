/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { ROUTE_HOME, ROUTE_NOT_FOUND } from '@/app.config';
import { GET_FISHBOWL } from '@/lib/gql/Fishbowl';
import withIsFishbowlEnded from '@/hocs/withIsFishbowlEnded';
import { useStateValue } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import Error from '@/components/Common/Error';
import Loader from '@/components/Web/Loader';
import useTranslation from 'next-translate/useTranslation';
import { IConferenceStatus } from '@/jitsi/Status';
import { createApolloClient } from '@/lib/apollo-client';
import { Fishbowl } from '@/types/api-platform';
import FishbowlInvitationLanding from '@/components/Web/FishbowlInvitationLanding';

const Layout = dynamic(import('@/layouts/App'), { loading: () => <div /> });
const Fishbowl = dynamic(import('@/components/App/Fishbowl'), { loading: () => <div /> });

import LayoutWeb from '@/layouts/Default';
import Head from 'next/head';

const FishbowlPreJoin = dynamic(import('@/components/App/FishbowlPreJoin'), {
  loading: () => <div />
});

interface Props {
  fishbowl: Fishbowl;
}

const Page = ({ fishbowl }: Props) => {
  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const router = useRouter();
  const { lang } = useTranslation();
  const [{ fishbowlReady, isGuest, prejoin, conferenceStatus }] = useStateValue();
  const { isAuthenticated } = useAuth();
  console.log(fishbowl);
  // const { fid } = router.query;
  // const { loading, error, data } = useQuery(GET_FISHBOWL, { variables: { slug: fid } });

  const handleJoinAsGuest = (): void => {
    setJoinAsGuest(true);
  };

  // const shouldPrintPreJoinPage: boolean =
  //   (joinAsGuest || isAuthenticated) && prejoin && fishbowlReady;
  // const shouldPrintFishbowlPage: boolean = fishbowlReady && (isAuthenticated || isGuest);

  useEffect(() => {
    router.beforePopState(({ as }): boolean => {
      if (as === '/fishbowl/host-now' || as.includes('/fishbowl/detail')) {
        router.replace(ROUTE_HOME, ROUTE_HOME, { locale: lang });
        return false;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const fishbowlTitle = fishbowl.isPrivate ? `🔒 ${fishbowl.name}` : fishbowl.name;

  // if (!fishbowl) {
  //   router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
  //   return <Loader />;
  // }

  return (
    <>
      <Head>
        <title>AITORRR NOOO DONDE TE SENTASTE</title>
      </Head>
      <LayoutWeb title={fishbowlTitle}>
        <FishbowlInvitationLanding handleJoinAsGuest={handleJoinAsGuest} fishbowl={fishbowl} />
      </LayoutWeb>
    </>
  );

  // return shouldPrintPreJoinPage || shouldPrintFishbowlPage ? (
  //   <Layout
  //     className={conferenceStatus === IConferenceStatus.NOT_STARTED ? 'prefishbowl' : ''}
  //     data={fishbowl}
  //     prejoin={shouldPrintPreJoinPage}
  //     title={fishbowlTitle}
  //   >
  //     {shouldPrintPreJoinPage ? <FishbowlPreJoin /> : <Fishbowl />}
  //   </Layout>
  // ) : (
  //   <LayoutWeb>
  //     <FishbowlInvitationLanding handleJoinAsGuest={handleJoinAsGuest} fishbowl={fishbowl} />
  //   </LayoutWeb>
  // );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const fid = params ? params.fid : '';
  const apolloClient = createApolloClient();
  const { data } = await apolloClient.query({
    query: GET_FISHBOWL,
    variables: { slug: fid as string }
  });

  console.log(data);

  const { bySlugQueryFishbowl: fishbowl } = data;

  return {
    props: { fishbowl: fishbowl }
  };
};

export default Page;
