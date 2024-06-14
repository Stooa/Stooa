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
import Wysiwyg from '@/ui/Wysiwyg';

const CookiesPolicy = () => {
  const { t } = useTranslation('legals');

  useEffect(() => {
    const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID;
    if (cookiebotId) {
      const cookiebotDec = document.createElement('script');
      cookiebotDec.src = `https://consent.cookiebot.com/${cookiebotId}/cd.js`;
      cookiebotDec.id = 'CookieDeclaration';

      const cookiesContainer = document.getElementById('cookies-container');

      if (cookiesContainer) {
        cookiesContainer.appendChild(cookiebotDec);
      }
    }
  }, []);

  return (
    <Layout title={t('cookiesPolicy.title')}>
      <Wysiwyg>
        <h1 className="title-lg">{t('cookiesPolicy.title')}</h1>
        <div id="cookies-container" />
      </Wysiwyg>
    </Layout>
  );
};

export default CookiesPolicy;
