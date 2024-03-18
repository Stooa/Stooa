/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WorldCafeForm from '@/components/Web/Forms/WorldCafeForm/WorldCafeForm';
import Layout from '@/layouts/Default';
import useTranslation from 'next-translate/useTranslation';

const WorldcafeCreate = () => {
  const { t } = useTranslation('form');

  return (
    <Layout title={t('worldCafe.pageTitle')}>
      <h1 className="title-md form-title">{t('worldCafe.pageTitle')}</h1>
      <WorldCafeForm />
    </Layout>
  );
};

export default WorldcafeCreate;
