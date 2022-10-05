/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import { useFlags } from 'flags/client';
import { getFlags } from 'flags/server';

import { GET_SELF_USER } from '@/lib/gql/User';

const ProfileForm = dynamic(import('@/components/Web/Forms/profile'), { loading: () => <div /> });
const Layout = dynamic(import('@/layouts/Default'), { loading: () => <div /> });
const Loader = dynamic(import('@/components/Web/Loader'), { loading: () => <div /> });
const Error = dynamic(import('@/components/Common/Error'), { loading: () => <div /> });

const EditProfile = props => {
  const { t } = useTranslation('edit-profile');
  const { flags } = useFlags({ initialState: props.initialFlagState });

  const { loading, error, data, refetch } = useQuery(GET_SELF_USER);

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <Layout title={t('title')}>
      <h1 className="title-md form-title">{t('title')}</h1>
      {flags?.cdti && <h2>CDTI!</h2>}
      <ProfileForm userData={data.selfUser} refetch={refetch} />
    </Layout>
  );
};

export const getServerSideProps = async context => {
  const { initialFlagState } = await getFlags({ context });
  return { props: { initialFlagState } };
};

export default EditProfile;
