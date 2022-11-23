/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import { useAuth } from '@/contexts/AuthContext';
import RecoverPasswordForm from '@/user/forms/recover-password';
import Layout from '@/layouts/Default';
import Description from '@/components/Common/Description';

const RecoverPassword = () => {
  const { t } = useTranslation('recover');
  const { loading } = useAuth();

  return loading ? (
    <></>
  ) : (
    <Layout title={t('title')}>
      <h1 className="title-md">{t('title')}</h1>
      <Description>{t('description')}</Description>
      <RecoverPasswordForm />
    </Layout>
  );
};

export default RecoverPassword;
