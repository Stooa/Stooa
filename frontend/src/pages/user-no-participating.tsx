/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import RedirectLink from '@/components/Web/RedirectLink';
import Button from '@/components/Common/Button';
import React, { useEffect } from 'react';
import { ROUTE_FISHBOWL } from '@/app.config';
import { useRouter } from 'next/router';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStateValue } from '@/contexts/AppContext';

const UserNoParticipatingPage = () => {
  const { t, lang } = useTranslation('user-no-participating');
  const router = useRouter();
  const { fid } = router.query;
  const fbRoute = `${ROUTE_FISHBOWL}/${fid}`;
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
  }, []); // es

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title> XXX
      </Head>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <ul>
        <li>{t('firstReason')}</li>
        <li>{t('secondReason')}</li>
      </ul>
      {fid && (
        <RedirectLink href={fbRoute} locale={lang} passHref>
          <Button size="large" variant="primary" as="a">
            {t('backButton')}
          </Button>
        </RedirectLink>
      )}
    </>
  );
};

export default UserNoParticipatingPage;
