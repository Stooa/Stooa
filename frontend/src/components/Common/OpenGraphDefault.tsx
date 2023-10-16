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

import { APP_NAME, TWITTER_USER, ROUTE_HOME } from '@/app.config';

interface Props {
  seoTitle?: string;
  seoDescription?: string;
}

const OpenGraphDefault = ({ seoTitle, seoDescription }: Props) => {
  const { t } = useTranslation('common');

  const ogImageSrc = 'img/web/OGimage.jpg';
  const ogImageTwitterSrc = 'img/web/OGimage-twitter.jpg';
  const metaTitle = seoTitle ? `${seoTitle} | ${APP_NAME}` : `${APP_NAME} | ${t('og-title')}`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={seoDescription ?? t('og-description')} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={seoDescription ?? t('og-description')} />

      <meta property="og:url" content={ROUTE_HOME} />
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${ogImageSrc}`} />
      <meta property="og:site_name" content={APP_NAME} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={`@${TWITTER_USER}`} />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${ogImageTwitterSrc}`}
      />
    </Head>
  );
};

export default OpenGraphDefault;
