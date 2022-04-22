/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import { Fishbowl } from '@/types/api-platform';
import { ROUTE_HOME, ROUTE_FISHBOWL, ROUTE_SIGN_IN, ROUTE_REGISTER } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import AvatarIcon from '@/ui/svg/avatar.svg';
import Logo from '@/components/Common/Logo';
import Navigation, { Avatar } from '@/components/Web/FishbowlDetailHeader/styles';
import Button from '@/components/Common/Button';
import RedirectLink from '../RedirectLink';

interface Props {
  data: Fishbowl;
}

const Header: React.FC<Props> = ({ data }) => {
  const { logout, isAuthenticated, user } = useAuth();
  const { t } = useTranslation('common');
  const redirectPath = `${ROUTE_FISHBOWL}/${data.slug}`;

  return (
    <>
      <Logo href={ROUTE_HOME} />
      <Navigation>
        {isAuthenticated ? (
          <>
            <Avatar>
              <AvatarIcon />
              <span>{user.name}</span>
            </Avatar>
            <Button size="small" onClick={logout}>
              <span>{t('signout')}</span>
            </Button>
          </>
        ) : (
          <>
            <RedirectLink href={`${ROUTE_SIGN_IN}?redirect=${redirectPath}`} passHref>
              <Button size="small" as="a">
                <span>{t('signin')}</span>
              </Button>
            </RedirectLink>
            <RedirectLink href={`${ROUTE_REGISTER}?redirect=${redirectPath}`} passHref>
              <Button size="small" variant="secondary" as="a">
                <span>{t('register')}</span>
              </Button>
            </RedirectLink>
          </>
        )}
      </Navigation>
    </>
  );
};

export default Header;
