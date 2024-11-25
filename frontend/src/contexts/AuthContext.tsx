/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import cookie from 'js-cookie';

import {
  ROUTE_CHANGE_PASSWORD,
  ROUTE_EDIT_PROFILE,
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_DETAIL,
  ROUTE_FISHBOWL_FINISHED,
  ROUTE_FISHBOWL_HOST_NOW,
  ROUTE_FISHBOWL_SCHEDULED,
  ROUTE_SLACK,
  ROUTE_SLACK_RETURN,
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_HOME,
  ROUTE_INTEGRATIONS,
  ROUTE_RECOVER_PASSWORD,
  ROUTE_REGISTER,
  ROUTE_RESET_PASSWORD,
  ROUTE_SIGN_IN
} from '@/app.config';

import {
  COOKIE_OPTIONS,
  COOKIE_REFRESH,
  COOKIE_TOKEN,
  getAuthToken,
  setRefreshToken,
  setToken
} from '@/user/auth';

import { Auth, StatusPayload } from '@/types/contexts/auth-context';
import { useUser } from '@/jitsi';
import api from '@/lib/api';
import { AuthToken } from '@/user/auth/authToken';
import Layout from '@/layouts/Clean';
import LoadingIcon from '@/components/Common/LoadingIcon';
import { User } from '@/types/user';
import { useStateValue } from '@/contexts/AppContext';
import createGenericContext from '@/contexts/createGenericContext';

const authenticatedRoutes = [
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_HOST_NOW,
  ROUTE_FISHBOWL_DETAIL,
  ROUTE_FISHBOWL_SCHEDULED,
  ROUTE_FISHBOWL_FINISHED,
  ROUTE_FISHBOWL_THANKYOU,
  ROUTE_EDIT_PROFILE,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_SLACK,
  ROUTE_SLACK_RETURN,
  ROUTE_INTEGRATIONS
];

const unauthenticatedRoutes = [
  ROUTE_SIGN_IN,
  ROUTE_REGISTER,
  ROUTE_RECOVER_PASSWORD,
  ROUTE_RESET_PASSWORD
];

const [useAuth, AuthContextProvider] = createGenericContext<Auth>();

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [, dispatch] = useStateValue();
  const router = useRouter();
  const { lang } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState<null | StatusPayload>(null);
  const [createFishbowl, setCreateFishbowl] = useState(false);
  const { setUserNickname } = useUser();

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

        if (user) {
          setUser(user);
          setUserNickname(user.name);
          dispatch({
            type: 'JOIN_USER',
            isGuest: false
          });
        }

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
    setUserNickname('');
    setUser(null);
  };

  const updateUser = (user: User) => setUser(user);
  const updateLogingStatus = () => setLoginStatus(null);
  const updateCreateFishbowl = (value: boolean) => setCreateFishbowl(value);

  if (
    createFishbowl &&
    !router.pathname.startsWith(ROUTE_FISHBOWL_CREATE) &&
    !router.pathname.startsWith(ROUTE_FISHBOWL_DETAIL)
  ) {
    setCreateFishbowl(false);
  }

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

  return (
    <AuthContextProvider
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
      }}
    >
      {children}
    </AuthContextProvider>
  );
};

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

const ProtectRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { lang } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const protectedRoutes =
    (!isAuthenticated && authenticatedRoutes.includes(router.pathname)) ||
    (isAuthenticated && unauthenticatedRoutes.includes(router.pathname));

  const handleRedirection = () => {
    if (!loading && protectedRoutes) {
      let pathname;

      if (isAuthenticated) {
        pathname = router.query.redirect || ROUTE_HOME;
      } else {
        pathname = `${ROUTE_REGISTER}?redirect=${router.pathname}${
          router.query.method === 'now' ? '?method=now' : ''
        }`;
      }
      const route = pathname.toString();
      router.replace(route, route, { locale: lang });
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

  return <>{children}</>;
};

export { AuthProvider, ProtectRoute, useAuth };
