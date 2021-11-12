/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User } from '@/types/user';

export interface Auth {
  user: User;
  isAuthenticated: boolean;
  loginStatus: StatusPayload;
  loading: boolean;
  createFishbowl: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateLogingStatus: () => void;
  updateCreateFishbowl: (val: boolean) => void;
};

export interface StatusPayload {
  type: string;
  data: {
    code?: number;
    message?: string;
    token?: string;
    refresh_token?: string;
  };
}
