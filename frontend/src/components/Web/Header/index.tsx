/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { pushEventDataLayer } from '@/lib/analytics';

import {
  ROUTE_HOME,
  ROUTE_SIGN_IN,
  ROUTE_REGISTER,
  ROUTE_FISHBOWL_CREATE,
  ROUTE_FISHBOWL_PAST,
  ROUTE_FISHBOWL_FUTURE
} from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Common/Logo';
import Avatar from '@/components/Web/Avatar';
import RedirectLink from '@/components/Web/RedirectLink';
import Navigation from '@/components/Web/Header/styles';
import Button from '@/components/Common/Button';

interface Props {
  navigation?: boolean;
}

const Header: React.FC<Props> = ({ navigation = true }) => {
  const { createFishbowl, isAuthenticated } = useAuth();
  const { t, lang } = useTranslation('common');
  const { pathname } = useRouter();

  return (
    <>
      <Logo href={ROUTE_HOME} />
      {navigation && (
        <Navigation>
          {isAuthenticated ? (
            <>
              {!createFishbowl &&
                pathname !== ROUTE_FISHBOWL_CREATE &&
                pathname !== ROUTE_FISHBOWL_FUTURE &&
                pathname !== ROUTE_FISHBOWL_PAST && (
                  <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
                    <Button
                      className="hide-mobile"
                      size="medium"
                      variant="secondary"
                      onClick={() => {
                        pushEventDataLayer({
                          category: 'Schedule Fishbowl',
                          action: 'Header',
                          label: window.location.href
                        });
                      }}
                    >
                      <span>{t('scheduleFishbowl')}</span>
                    </Button>
                  </RedirectLink>
                )}
              <Avatar />
            </>
          ) : (
            <>
              {pathname !== ROUTE_SIGN_IN && (
                <RedirectLink href={ROUTE_SIGN_IN} passHref>
                  <Button variant="text" size="medium" as="a" data-testid="login">
                    <span>{t('signin')}</span>
                  </Button>
                </RedirectLink>
              )}
              {pathname !== ROUTE_REGISTER && (
                <RedirectLink href={ROUTE_REGISTER} passHref>
                  <Button
                    className="never-full"
                    size="medium"
                    variant="secondary"
                    as="a"
                    data-testid="register"
                  >
                    <span>{t('register')}</span>
                  </Button>
                </RedirectLink>
              )}
            </>
          )}
        </Navigation>
      )}
    </>
  );
};

export default Header;
