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
import { ROUTE_HOME, ROUTE_FISHBOWL, ROUTE_SIGN_IN, ROUTE_REGISTER } from 'app.config';
import { useAuth } from 'contexts/AuthContext';
import { ButtonSmall, ButtonTransp } from 'ui/Button';
import ArrowRight from 'ui/svg/arrow-right.svg';
import AvatarIcon from 'ui/svg/avatar.svg';
import Logo from 'components/Common/Logo';
import Navigation, { Avatar } from 'components/Web/FishbowlDetailHeader/styles';

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
            <ButtonTransp onClick={logout}>
              <span>{t('signout')}</span>
            </ButtonTransp>
          </>
        ) : (
          <>
            <Link href={`${ROUTE_SIGN_IN}?redirect=${redirectPath}`} passHref>
              <ButtonTransp as="a">
                <span>{t('signin')}</span>
              </ButtonTransp>
            </Link>
            <Link href={`${ROUTE_REGISTER}?redirect=${redirectPath}`} passHref>
              <ButtonSmall className="secondary" as="a">
                <span>{t('register')}</span>
                <ArrowRight />
              </ButtonSmall>
            </Link>
          </>
        )}
      </Navigation>
    </>
  );
};

export default Header;
