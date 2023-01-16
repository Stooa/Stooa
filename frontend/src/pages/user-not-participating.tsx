/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import React, { useEffect } from 'react';
import { ROUTE_FISHBOWL } from '@/app.config';
import { useRouter } from 'next/router';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStateValue } from '@/contexts/AppContext';
import Layout from '@/layouts/Default';
import { Content } from '@/layouts/KickedUser/styles';
import Info from '@/ui/svg/info-brown.svg';
import Image from 'next/image';

const UserNoParticipatingPage = () => {
  const { t, lang } = useTranslation('user-not-participating');
  const router = useRouter();
  const { fid } = router.query;
  const fbRoute = `${ROUTE_FISHBOWL}/${fid}`;
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
  }, []); // es

  return (
    <>
      <Layout title={t('pageTitle')}>
        <Content>
          <div className="friend-image">
            <Image
              src="/img/friends/meditating.png"
              alt="Illustration of a friend meditating"
              height={146.38 * 1.5}
              width={151 * 1.5}
              quality={100}
            />
          </div>
          <h1 className="title-sm">{t('title')}</h1>
          <p className="description body-lg">{t('description')}</p>
          <div className="reasons">
            <Info />
            <ul>
              <li>{t('firstReason')}</li>
              <li>{t('secondReason')}</li>
            </ul>
          </div>
          {fid && (
            <RedirectLink href={fbRoute} locale={lang} passHref>
              <Button size="large" variant="primary" as="a">
                {t('backButton')}
              </Button>
            </RedirectLink>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default UserNoParticipatingPage;
