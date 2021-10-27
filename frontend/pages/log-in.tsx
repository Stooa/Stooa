/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import { useAuth } from 'contexts/AuthContext';
import Layout from 'layouts/Default';
import LogInForm from 'components/Web/Forms/log-in';

const SignIn = () => {
  const { t } = useTranslation('login');
  const { loading } = useAuth();

  return loading ? (
    <></>
  ) : (
    <Layout title={t('title')}>
      <h1 className="title-md">{t('title')}</h1>
      <LogInForm />
    </Layout>
  );
};

export default SignIn;
