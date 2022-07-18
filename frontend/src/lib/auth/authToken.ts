/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import jwtDecode from 'jwt-decode';

export type User = {
  email: string;
  name: string;
  twitter: string;
  linkedin: string;
};

export type DecodedToken = {
  readonly context: {
    user: User;
  };
  readonly exp: number;
};

export class AuthToken {
  readonly _token: string | undefined;
  readonly _decodedToken: DecodedToken;
  readonly _initialValues: DecodedToken = {
    context: { user: { email: '', name: '', twitter: '', linkedin: '' } },
    exp: 0
  };

  constructor(_token?: string) {
    this._token = _token;
    this._decodedToken = this._initialValues;
    try {
      if (_token) this._decodedToken = jwtDecode(_token);
    } catch (e) {}
  }

  get expiresAt(): Date {
    return new Date(this._decodedToken.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isAuthenticated(): boolean {
    return !this.isExpired;
  }

  get decodedToken() {
    return this.isAuthenticated ? this._decodedToken : this._initialValues;
  }

  get authorizationString() {
    return this._token ? `Bearer ${this._token}` : '';
  }

  get token() {
    return this._token;
  }

  get user() {
    return this._decodedToken.context.user;
  }
}
