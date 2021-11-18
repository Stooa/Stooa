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
import LocaleCookie from '@/lib/LocaleCookie';

const usePersistLocaleCookie = () => {
  const { locale, defaultLocale } = useRouter();

  useEffect(() => {
    if (locale !== defaultLocale) {
      LocaleCookie.setLocaleCookie(locale);
    }
  }, [locale, defaultLocale]);
};

export default usePersistLocaleCookie;
