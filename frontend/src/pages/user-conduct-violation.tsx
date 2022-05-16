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
import React from 'react';
import { ROUTE_FISHBOWL } from '@/app.config';

interface ParticipantKickedPageProps {
  reason?: string;
  slug?: string;
}

const UserConductViolationPage = ({ reason, slug }: ParticipantKickedPageProps) => {
  const { t, lang } = useTranslation('user-conduct-violation');
  const fbRoute = `${ROUTE_FISHBOWL}/${slug}`;

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title> XXX
      </Head>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      {slug && (
        <RedirectLink href={fbRoute} locale={lang} passHref>
          <Button size="large" variant="primary" as="a">
            {t('backButton')}
          </Button>
        </RedirectLink>
      )}
    </>
  );
};

export default UserConductViolationPage;
