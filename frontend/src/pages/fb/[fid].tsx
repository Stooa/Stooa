/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
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
import FishbowlInvitationLanding from '@/components/Web/FishbowlInvitationLanding';

const Layout = dynamic(import('@/layouts/App'), { loading: () => <div /> });
const LayoutWeb = dynamic(import('@/layouts/FishbowlDetail'), { loading: () => <div /> });
const Fishbowl = dynamic(import('@/components/App/Fishbowl'), { loading: () => <div /> });
const FishbowlLanding = dynamic(import('@/components/Web/FishbowlLanding'), {
  loading: () => <div />
});
const JoinFishbowl = dynamic(import('@/components/Web/JoinFishbowl'), { loading: () => <div /> });
const FishbowlPreJoin = dynamic(import('@/components/App/FishbowlPreJoin'), {
  loading: () => <div />
});

const Page = () => {
  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const router = useRouter();
  const { lang } = useTranslation();
  const [{ fishbowlReady, isGuest, prejoin, conferenceStatus }] = useStateValue();
  const { isAuthenticated } = useAuth();
  const { fid } = router.query;
  const { loading, error, data } = useQuery(GET_FISHBOWL, { variables: { slug: fid } });

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

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader />;
  if (error) {
    router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
    return <Error message={error.message} />;
  }

  const { bySlugQueryFishbowl: fb } = data;
  const fishbowlTitle = fb.isPrivate ? `🔒 ${fb.name}` : fb.name;

  if (!fb) {
    router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
    return <Loader />;
  }

  return shouldPrintPreJoinPage || shouldPrintFishbowlPage ? (
    <Layout
      className={conferenceStatus === IConferenceStatus.NOT_STARTED ? 'prefishbowl' : ''}
      data={fb}
      prejoin={shouldPrintPreJoinPage}
      title={fishbowlTitle}
    >
      {shouldPrintPreJoinPage ? <FishbowlPreJoin /> : <Fishbowl />}
    </Layout>
  ) : (
    <LayoutWeb>
      {/* TODO: HERE IS WHERE THE LANDING WILL GO */}
      <FishbowlInvitationLanding fishbowl={fb} />
      {/* <FishbowlLanding data={fb} />
      <JoinFishbowl data={fb} joinAsGuest={handleJoinAsGuest} /> */}
    </LayoutWeb>
  );
};

export default withIsFishbowlEnded(Page);

/**
 * Workaround for:
 * [next-translate] In Next 10.x.x there is an issue related to i18n and getInitialProps.
 * We recommend to replace getInitialProps to getServerSideProps on /index.tsx.
 *
 * https://github.com/vercel/next.js/discussions/18396
 */
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  };
};

/**
 * Error: getStaticPaths is required for dynamic SSG pages and is missing for
 * '/fishbowl/detail/[fid]'.
 * Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value
 */
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  };
};
