/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cookie from 'js-cookie';

const LocaleCookie = () => {
  const COOKIE_LOCALE = 'NEXT_LOCALE';
  const COOKIE_OPTIONS = { path: '/', domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN };
  const COOKIE_REFRESH_DAYS = 100;
  
  const setLocaleCookie = (locale: string) => {
    cookie.set(COOKIE_LOCALE, locale, { ...COOKIE_OPTIONS, expires: COOKIE_REFRESH_DAYS });
  };

  const getCurrentLocaleCookie = (): string => {
    return cookie.get(COOKIE_LOCALE);
  };

  return {
    getCurrentLocaleCookie,
    setLocaleCookie
  };
};

export default LocaleCookie();
