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
import { Content } from '@/layouts/KickedUser/styles';
import Image from 'next/image';

const UserConductViolationPage = () => {
  const { t } = useTranslation('user-conduct-violation');
  const [, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'FISHBOWL_STATUS',
      fishbowlReady: true,
      fishbowlStarted: true,
      isGuest: false,
      prejoin: true,
      conferenceStatus: IConferenceStatus?.NOT_STARTED
    });
  }, []);

  return (
    <Layout title={t('pageTitle')}>
      <Content>
        <Image
          className="friend-image"
          src="/img/friends/reading.png"
          alt="Illustration of a friend reading"
          height={146 * 1.5}
          width={140.06 * 1.5}
          quality={100}
        />

        <h1 className="title-sm">{t('title')}</h1>
        <p className="body-lg">{t('description')}</p>
      </Content>
    </Layout>
  );
};

export default UserConductViolationPage;
