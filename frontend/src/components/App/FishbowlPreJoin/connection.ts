/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import api from '@/lib/api';
import { getAuthToken } from '@/user/auth';

export const connectWithPassword = async (
  password: string,
  slug: string
): Promise<{ data: { response: boolean } }> => {
  const auth = await getAuthToken();
  const params = new FormData();

  params.append('password', password);

  return api.post(`es/private-password/${slug}`, params, {
    headers: {
      Authorization: `${auth ? auth.authorizationString : null}`
    }
  });
};
