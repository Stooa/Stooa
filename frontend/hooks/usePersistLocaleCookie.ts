/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const usePersistLocaleCookie = () => {
  const { locale, defaultLocale } = useRouter();

  useEffect(() => {
    if (locale !== defaultLocale) {
      const date = new Date();
      const expireMs = 100 * 365 * 24 * 60 * 60 * 1000; // 100 days
      date.setTime(date.getTime() + expireMs);
      document.cookie = `NEXT_LOCALE=${locale};expires=${date.toUTCString()};path=/`;
    }
  }, [locale, defaultLocale]);
};

export default usePersistLocaleCookie;
