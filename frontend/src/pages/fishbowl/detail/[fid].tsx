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
  const referer = props.referer ? props.referer : '';

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

  if (!referer.includes('/create')) {
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
          <p className="body-md bold">{t('preTitle')}</p>
          <p>{t('preSubtitle')}</p>
        </Alert>
      )}
      <FishbowlDetail data={fb} />
      <JoinFishbowl data={fb} isCreator />
    </Layout>
  );
};

export default Detail;

export async function getServerSideProps(context) {
  const referer = context.req.headers.referer || null;
  return {
    props: { referer }
  };
}
