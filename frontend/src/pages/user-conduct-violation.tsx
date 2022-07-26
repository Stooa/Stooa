/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import React, { useEffect } from 'react';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStateValue } from '@/contexts/AppContext';
import Layout from '@/layouts/Default';
import ReadingFriend from '@/components/Common/SVG/ReadingFriend';
import { Content } from '@/layouts/KickedUser/styles';

const UserConductViolationPage = () => {
  const { t } = useTranslation('user-conduct-violation');
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'FISHBOWL_STATUS',
      fishbowlReady: true,
      fishbowlStarted: true,
      isGuest: false,
      prejoin: true,
      conferenceStatus: IConferenceStatus?.NOT_STARTED
    });
  }, [dispatch]);

  return (
    <Layout title={t('pageTitle')}>
      <Content>
        <ReadingFriend />
        <h1 className="title-sm">{t('title')}</h1>
        <p className="body-lg">{t('description')}</p>
      </Content>
    </Layout>
  );
};

export default UserConductViolationPage;
