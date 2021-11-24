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

import { ROUTE_HOME, ROUTE_SIGN_IN, ROUTE_REGISTER, ROUTE_FISHBOWL_CREATE } from 'app.config';
import { useAuth } from 'contexts/AuthContext';
import { ButtonSmall, ButtonTransp } from 'ui/Button';
import ArrowRight from 'ui/svg/arrow-right.svg';
import Logo from 'components/Common/Logo';
import Avatar from 'components/Web/Avatar';
import RedirectLink from 'components/Web/RedirectLink';
import Navigation from 'components/Web/Header/styles';

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
              {!createFishbowl && pathname !== ROUTE_FISHBOWL_CREATE && (
                <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
                  <ButtonSmall
                    className="secondary"
                    onClick={() => {
                      pushEventDataLayer({
                        category: 'Create Fishbowl',
                        action: 'Header',
                        label: window.location.href
                      });
                    }}>
                    <span>{t('createEvent')}</span>
                    <ArrowRight />
                  </ButtonSmall>
                </RedirectLink>
              )}
              <Avatar />
            </>
          ) : (
            <>
              {pathname !== ROUTE_SIGN_IN && (
                <RedirectLink href={ROUTE_SIGN_IN} passHref>
                  <ButtonTransp as="a" data-testid="login">
                    <span>{t('signin')}</span>
                  </ButtonTransp>
                </RedirectLink>
              )}
              {pathname !== ROUTE_REGISTER && (
                <RedirectLink href={ROUTE_REGISTER} passHref>
                  <ButtonSmall className="secondary" as="a" data-testid="register">
                    <span>{t('register')}</span>
                    <ArrowRight />
                  </ButtonSmall>
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
