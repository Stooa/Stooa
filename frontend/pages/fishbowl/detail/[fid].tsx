/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL, ROUTE_NOT_FOUND } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import { GET_FISHBOWL } from '@/lib/gql/Fishbowl';
import { dataLayerPush } from '@/lib/analytics';
import Alert from '@/ui/Alert';

const FishbowlDetail = dynamic(import('@/components/Web/FishbowlDetail'), {
  loading: () => <div />
});
const JoinFishbowl = dynamic(import('@/components/Web/JoinFishbowl'), {
  loading: () => <div />
});
const Layout = dynamic(import('@/layouts/Default'), { loading: () => <div /> });
const Loader = dynamic(import('@/components/Web/Loader'), { loading: () => <div /> });
const Error = dynamic(import('@/components/Common/Error'), { loading: () => <div /> });

const Detail = props => {
  const { t } = useTranslation('fishbowl');
  const router = useRouter();
  const { lang } = useTranslation();
  const { createFishbowl } = useAuth();

  const { fid } = router.query;
  const { loading, error, data } = useQuery(GET_FISHBOWL, { variables: { slug: fid } });

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const { bySlugQueryFishbowl: fb } = data;
  const showTitle = createFishbowl;

  if (!fb) {
    router.push(ROUTE_NOT_FOUND, ROUTE_NOT_FOUND, { locale: lang });
    return <Loader />;
  }

  if (!props.referer.includes('/create')) {
    const route = `${ROUTE_FISHBOWL}/${fid}`;
    router.push(route, route, { locale: lang });
    return <Loader />;
  }

  dataLayerPush({
    event: 'GAPageView',
    pageViewUrl: `/fishbowl-created`,
    pageViewTitle: `Fishbowl created ${fid}`
  });

  return (
    <Layout title={fb.name} decorated>
      {showTitle && (
        <Alert className="success" block>
          <p className="title-sm">{t('preTitle')}</p>
          <p>{t('preSubtitle')}</p>
        </Alert>
      )}
      <FishbowlDetail data={fb} />
      <JoinFishbowl data={fb} isCreator />
    </Layout>
  );
};

export default Detail;

/**
 * Workaround for:
 * [next-translate] In Next 10.x.x there is an issue related to i18n and getInitialProps.
 * We recommend to replace getInitialProps to getServerSideProps on /index.tsx.
 *
 * https://github.com/vercel/next.js/discussions/18396
 */
// export const getStaticProps: GetStaticProps = async props => {
//   return {
//     props: { props }
//   };
// };

/**
 * Error: getStaticPaths is required for dynamic SSG pages and is missing for
 * '/fishbowl/detail/[fid]'.
 * Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value
 */
// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: 'blocking' //indicates the type of fallback
//   };
// };

export async function getServerSideProps(context) {
  const referer = context.req.headers.referer;
  return {
    props: { referer }
  };
}
