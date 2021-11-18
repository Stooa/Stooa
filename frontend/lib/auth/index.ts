/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cookie from 'js-cookie';

import api from 'lib/api';
import { AuthToken } from 'lib/auth/authToken';
import userRepository from '@/jitsi/User';

const COOKIE_TOKEN = 'token';
const COOKIE_REFRESH = 'refresh_token';
const COOKIE_ON_BOARDING_MODERATOR = 'on_boarding_moderator';
const COOKIE_ON_BOARDING = 'on_boarding';
const COOKIE_ON_BOARDING_VALUE = true;
const COOKIE_REFRESH_DAYS = 30;
const COOKIE_ON_BOARDING_DAYS = 30;
const COOKIE_OPTIONS = { path: '/', domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN };

const setToken = (token: string) => {
  const auth = new AuthToken(token);
  if (auth) {
    cookie.set(COOKIE_TOKEN, token, { ...COOKIE_OPTIONS, expires: auth.decodedToken.exp });
  }
};

const setRefreshToken = (value: string) => {
  cookie.set(COOKIE_REFRESH, value, { ...COOKIE_OPTIONS, expires: COOKIE_REFRESH_DAYS });
};

const setOnBoardingCookie = (isModerator: boolean) => {
  const cookieName = isModerator ? COOKIE_ON_BOARDING_MODERATOR : COOKIE_ON_BOARDING;

  cookie.set(cookieName, COOKIE_ON_BOARDING_VALUE, {
    ...COOKIE_OPTIONS,
    expires: COOKIE_ON_BOARDING_DAYS
  });
};

const getOnBoardingCookie = (isModerator: boolean) => {
  const cookieName = isModerator ? COOKIE_ON_BOARDING_MODERATOR : COOKIE_ON_BOARDING;

  return cookie.get(cookieName);
};

const getToken = () => cookie.get(COOKIE_TOKEN);
const getRefreshToken = () => cookie.get(COOKIE_REFRESH);

const getAuthToken = async (force?: boolean, roomName?: string) => {
  const token = getToken();
  if (!token) return null;

  const auth = new AuthToken(token);

  if (force || (auth && auth.isExpired)) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    return await getRefreshedToken(auth.user.email, refreshToken, roomName);
  }
  return auth;
};

const getRefreshedToken = async (email: string, refresh_token: string, roomName?: string) => {
  const params = new FormData();
  params.append('email', email);
  params.append('refresh_token', refresh_token);

  if (roomName) {
    params.append('room', roomName);
  }

  return await api
    .post('refresh-token', params)
    .then(({ data }) => {
      console.log('[STOOA] Token refreshed successfully!');
      setToken(data.token);
      setRefreshToken(data.refresh_token);

      return new AuthToken(data.token);
    })
    .catch(err => {
      const { message, response } = err;
      const status = response ? `[${response.status} ${response.statusText}]` : '[ERROR]:';
      console.error(status, message);
      return null;
    });
};

const ping = async (lang: string, slug: string) => {
  const auth = await getAuthToken();
  const params = new FormData();
  const guestId = userRepository.getUserGuestId();

  if (guestId) {
    params.append('guestId', guestId);
  }

  api
    .post(`${lang}/ping/${slug}`, params, {
      headers: { Authorization: `${auth ? auth.authorizationString : null}` }
    })
    .catch(err => {
      const { message, response } = err;
      const status = response ? `[${response.status} ${response.statusText}]` : '[ERROR]:';
      console.error(status, message);
      return null;
    });
};

const getParticipants = async (lang: string, slug: string) => {
  const auth = await getAuthToken();

  return api.get(`${lang}/fishbowl-participants/${slug}`, {
    headers: { Authorization: `${auth ? auth.authorizationString : null}` }
  });
};

const isCurrentGuest = (guestId: string|null) => {
  return guestId !== null && userRepository.getUserGuestId() === guestId;
};

export {
  COOKIE_OPTIONS,
  COOKIE_REFRESH,
  COOKIE_TOKEN,
  getAuthToken,
  getOnBoardingCookie,
  getParticipants,
  isCurrentGuest,
  ping,
  setOnBoardingCookie,
  setRefreshToken,
  setToken
};
