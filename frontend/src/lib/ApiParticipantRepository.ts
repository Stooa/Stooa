/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import api from '@/lib/api';
import LocaleCookie from '@/lib/LocaleCookie';
import { getAuthToken } from '@/user/auth';
import { Participant } from '@/types/participant';

const getApiParticipantList = async (lang: string, slug: string): Promise<Participant[]> => {
  const auth = await getAuthToken();

  const axiosResponse = await api.get(`${lang}/fishbowl-participants/${slug}`, {
    headers: {
      'Accept-Language': LocaleCookie.getCurrentLocaleCookie(),
      'Authorization': `${auth ? auth.authorizationString : null}`
    }
  });

  return axiosResponse.data.response;
};

export { getApiParticipantList };
