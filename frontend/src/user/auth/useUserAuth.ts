/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cookie from 'js-cookie';

import api from '@/lib/api';
import LocaleCookie from '@/lib/LocaleCookie';
import { useUser } from '@/jitsi';
import { COOKIE_OPTIONS, getAuthToken } from '.';
import { EventType } from '@/types/event-types';

const COOKIE_SHARE_LINK_COOKIE = 'share_link';
const COOKIE_ON_BOARDING_MODERATOR = 'on_boarding_moderator';
const COOKIE_ON_BOARDING = 'on_boarding';
const COOKIE_ON_BOARDING_DAYS = 30;
const COOKIE_TRANSCRIPTION_LANGUAGE = 'transcription_language';

export const useUserAuth = () => {
  const { setUserParticipantId, setUserParticipantSlug, getUserGuestId } = useUser();

  const setShareLinkCookie = (fishbowlId: string): void => {
    const fourHours = 1 / 6;

    cookie.set(COOKIE_SHARE_LINK_COOKIE, fishbowlId, {
      ...COOKIE_OPTIONS,
      expires: fourHours
    });
  };

  const isFishbowlShareLinkCookie = (fishbowlId: string): boolean => {
    return cookie.get(COOKIE_SHARE_LINK_COOKIE) === fishbowlId;
  };

  const setOnBoardingCookie = (isModerator: boolean) => {
    const cookieName = isModerator ? COOKIE_ON_BOARDING_MODERATOR : COOKIE_ON_BOARDING;

    cookie.set(cookieName, 'true', {
      ...COOKIE_OPTIONS,
      expires: COOKIE_ON_BOARDING_DAYS
    });
  };

  const getOnBoardingCookie = (isModerator: boolean) => {
    const cookieName = isModerator ? COOKIE_ON_BOARDING_MODERATOR : COOKIE_ON_BOARDING;

    return cookie.get(cookieName);
  };

  const getTranscriptionLanguageCookie = () => {
    return cookie.get(COOKIE_TRANSCRIPTION_LANGUAGE);
  };

  const setTranscriptionLanguageCookie = (language: string) => {
    cookie.set(COOKIE_TRANSCRIPTION_LANGUAGE, language, {
      ...COOKIE_OPTIONS,
      expires: 30
    });
  };

  const ping = async (lang: string, slug: string, eventType: EventType = 'fishbowl') => {
    const auth = await getAuthToken();
    const params = new FormData();
    const guestId = getUserGuestId();

    if (guestId) {
      params.append('guestId', guestId);
    }

    const pingDestination = eventType === 'fishbowl' ? 'ping' : 'world-cafe-ping';

    api
      .post(`${lang}/${pingDestination}/${slug}`, params, {
        headers: {
          'Accept-Language': LocaleCookie.getCurrentLocaleCookie(),
          'Authorization': `${auth ? auth.authorizationString : null}`
        }
      })
      .then(res => {
        if (res.data.response) {
          const { participantId, participantSlug } = res.data.response;
          setUserParticipantId(participantId);
          setUserParticipantSlug(participantSlug);

          console.log('[STOOA] Ping response', res.data.response);
        }
      })
      .catch(err => {
        const { message, response } = err;
        const status = response ? `[${response.status} ${response.statusText}]` : '[ERROR]:';
        console.error(status, message);
        return null;
      });
  };

  const isCurrentGuest = (guestId: string | null) => {
    return guestId !== null && getUserGuestId() === guestId;
  };

  return {
    COOKIE_OPTIONS,
    getAuthToken,
    getOnBoardingCookie,
    isCurrentGuest,
    ping,
    setOnBoardingCookie,
    setShareLinkCookie,
    isFishbowlShareLinkCookie,
    getTranscriptionLanguageCookie,
    setTranscriptionLanguageCookie
  };
};
