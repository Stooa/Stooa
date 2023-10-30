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

export const SyncHubspotContacts = async () => {
  const auth = await getAuthToken();

  const axiosResponse = await api.post(
    `/hubspot/contacts/sync`,
    {},
    {
      headers: {
        'Accept-Language': LocaleCookie.getCurrentLocaleCookie(),
        'Authorization': `${auth ? auth.authorizationString : null}`
      }
    }
  );
  console.log(axiosResponse.data);
  return axiosResponse.data;
};
