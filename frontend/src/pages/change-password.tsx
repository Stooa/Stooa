/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import PasswordForm from '@/components/Web/Forms/change-password';
import Layout from '@/layouts/Default';

const ChangePassword = () => {
  const { t } = useTranslation('change-password');

  return (
    <Layout title={t('title')}>
      <h1 className="title-md form-title">{t('title')}</h1>
      <PasswordForm />
    </Layout>
  );
};

export default ChangePassword;
