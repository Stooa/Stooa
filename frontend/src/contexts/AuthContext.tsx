/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import cookie from 'js-cookie';

import {
  ROUTE_HOME,
  ROUTE_SIGN_IN,
  ROUTE_REGISTER,
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_DETAIL,
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_RECOVER_PASSWORD,
  ROUTE_EDIT_PROFILE,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_RESET_PASSWORD
} from '@/app.config';

import {
  COOKIE_OPTIONS,
  COOKIE_REFRESH,
  COOKIE_TOKEN,
  getAuthToken,
  setRefreshToken,
  setToken
} from '@/lib/auth';

import { Auth, StatusPayload } from '@/types/auth-context';
import api from '@/lib/api';
import { AuthToken } from '@/lib/auth/authToken';
import Layout from '@/layouts/Clean';
import LoadingIcon from '@/components/Common/LoadingIcon';

const authenticatedRoutes = [
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_DETAIL,
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_EDIT_PROFILE,
  ROUTE_CHANGE_PASSWORD
];

const unauthenticatedRoutes = [
  ROUTE_SIGN_IN,
  ROUTE_REGISTER,
  ROUTE_RECOVER_PASSWORD,
  ROUTE_RESET_PASSWORD
];

const voidFunction = () => console.log('[STOOA] Context not initialized yet');

const AuthContext = createContext<Auth | null>({
  isAuthenticated: false,
  user: {},
  login: () => Promise.resolve(),
  loginStatus: {},
  loading: true,
  createFishbowl: false,
  logout: voidFunction,
  updateUser: voidFunction,
  updateLogingStatus: voidFunction,
  updateCreateFishbowl: voidFunction
});

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { lang } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState<null | StatusPayload>(null);
  const [createFishbowl, setCreateFishbowl] = useState(false);

  useEffect(() => {
    const loadUserFromCookies = async () => {
      const auth = await getAuthToken();

      if (auth) {
        const user = auth.user;
        if (user) setUser(user);
      }

      setLoading(false);
    };

    loadUserFromCookies();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    return await api
      .post('login', { email, password }, { headers: { 'Accept-Language': lang } })
      .then(({ data }) => {
        const pathname = router.query.redirect || ROUTE_HOME;
        const auth = new AuthToken(data.token);
        const user = auth ? auth.user : null;
        const status: StatusPayload = {
          type: 'Success',
          data
        };

        if (user) setUser(user);

        setToken(data.token);
        setRefreshToken(data.refresh_token);
        const route = pathname.toString();
        router.push(route, route, { locale: lang }).then(() => {
          setLoading(false);
        });

        setLoginStatus(status);
        return status;
      })
      .catch(error => {
        const {
          response: { data }
        } = error;
        setLoading(false);

        const status: StatusPayload = {
          type: 'Error',
          data
        };

        setLoginStatus(status);
        return status;
      });
  };

  const logout = () => {
    cookie.remove(COOKIE_TOKEN, COOKIE_OPTIONS);
    cookie.remove(COOKIE_REFRESH, COOKIE_OPTIONS);
    router.pathname = '/'; // Change pathname to prevent ProtectedRoute redirection
    router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang }).then(() => {
      console.log('Redirected');
    });
    setUser(null);
  };

  const updateUser = user => setUser(user);
  const updateLogingStatus = () => setLoginStatus(null);
  const updateCreateFishbowl = val => setCreateFishbowl(val || false);

  if (
    createFishbowl &&
    !router.pathname.startsWith(ROUTE_FISHBOWL_CREATE) &&
    !router.pathname.startsWith(ROUTE_FISHBOWL_DETAIL)
  ) {
    setCreateFishbowl(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        loginStatus,
        loading,
        createFishbowl,
        logout,
        updateUser,
        updateLogingStatus,
        updateCreateFishbowl
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const { lang } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const protectedRoutes =
    (!isAuthenticated && authenticatedRoutes.includes(router.pathname)) ||
    (isAuthenticated && unauthenticatedRoutes.includes(router.pathname));

  const handleRedirection = () => {
    if (!loading && protectedRoutes) {
      const pathname = isAuthenticated
        ? router.query.redirect || ROUTE_HOME
        : `${ROUTE_REGISTER}?redirect=${router.pathname}`;
      const route = pathname.toString();
      router.push(route, route, { locale: lang });
    }
  };

  handleRedirection();
  useEffect(handleRedirection, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || protectedRoutes) {
    return (
      <Layout>
        <LoadingIcon />
      </Layout>
    );
  }

  return children;
};

export { AuthProvider, ProtectRoute, useAuth };
