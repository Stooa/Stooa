/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Axios from 'axios';
import LocaleCookie from '@/lib/LocaleCookie';

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
  headers: {
    'Accept': 'application/json',
    'Accept-Language': LocaleCookie.getCurrentLocaleCookie(),
    'Content-Type': 'application/json'
  }
});

export default api;
