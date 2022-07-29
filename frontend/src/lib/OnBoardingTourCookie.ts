/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cookie from 'js-cookie';

const OnBoardingTourCookie = () => {
  const COOKIE_LOCALE = 'on_boarding_tour';
  const COOKIE_OPTIONS = { path: '/', domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN };
  const COOKIE_REFRESH_DAYS = 100;

  const setOnBoardingCookie = () => {
    cookie.set(COOKIE_LOCALE, true, { ...COOKIE_OPTIONS, expires: COOKIE_REFRESH_DAYS });
  };

  const getOnBoardingTourCookie = (): string => {
    return cookie.get(COOKIE_LOCALE);
  };

  return {
    getOnBoardingTourCookie,
    setOnBoardingCookie
  };
};

export default OnBoardingTourCookie();
