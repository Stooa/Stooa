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
import { useRouter } from 'next/router';

const WorldcafeCreate = () => {
  const { t } = useTranslation('form');
  const router = useRouter();

  console.log(process.env.NEXT_PUBLIC_WORLD_CAFE);

  if (process.env.NEXT_PUBLIC_WORLD_CAFE === 'false') {
    router.push('/404');
  }

  return (
    <Layout verticalAlign="flex-start" horizontalAlign="center" title={t('worldCafe.pageTitle')}>
      <h1 className="title-md form-title">{t('worldCafe.pageTitle')}</h1>
      <WorldCafeForm />
    </Layout>
  );
};

export default WorldcafeCreate;
