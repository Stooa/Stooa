/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import Layout from '@/layouts/Default';
import CreateFishbowlForm from '@/components/Web/Forms/CreateFishbowl';

const Create = () => {
  const { t } = useTranslation('fishbowl');

  return (
    <Layout title={t('title')}>
      <h1 className="title-md">{t('title')}</h1>
      <CreateFishbowlForm />
    </Layout>
  );
};

export default Create;
