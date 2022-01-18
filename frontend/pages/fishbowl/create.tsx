/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';

import Layout from '@/layouts/Default';
import CreateFishbowlForm from '@/components/Web/Forms/CreateFishbowl';
import { useStateValue } from '@/contexts/AppContext';

import { IConferenceStatus } from '@/jitsi/Status';

const Create = () => {
  const { t } = useTranslation('fishbowl');
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'FISHBOWL_STATUS',
      fishbowlReady: false,
      fishbowlStarted: false,
      isGuest: false,
      prejoin: true,
      conferenceStatus: IConferenceStatus?.NOT_STARTED
    });
  }, []);

  return (
    <Layout title={t('title')}>
      <h1 className="title-md">{t('title')}</h1>
      <CreateFishbowlForm />
    </Layout>
  );
};

export default Create;
