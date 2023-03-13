/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import {
  ROUTE_EDIT_PROFILE,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_FISHBOWL_FUTURE,
  ROUTE_FISHBOWL_PAST
} from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import AvatarIcon from '@/ui/svg/avatar.svg';
import ChevronDown from '@/ui/svg/chevron-down.svg';
import Logout from '@/ui/svg/logout.svg';
import Lock from '@/ui/svg/lock.svg';
import Pencil from '@/ui/svg/pencil.svg';
import List from '@/ui/svg/list.svg';
import CheckList from '@/ui/svg/check-list.svg';
import { Avatar as AvatarStyled, Dropdown } from '@/components/Web/Avatar/styles';
import Trans from 'next-translate/Trans';

const Avatar: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation('common');

  const toggleDropdown = () => setActive(!active);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (active && wrapperRef.current && !wrapperRef.current.contains(target)) {
      toggleDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AvatarStyled ref={wrapperRef}>
      <button
        className={`avatar medium body-sm ${active ? 'active' : ''}`}
        onClick={toggleDropdown}
      >
        <AvatarIcon />
        <span>{user?.name}</span>
        <ChevronDown />
      </button>
      {active && (
        <Dropdown>
          <Link href={ROUTE_FISHBOWL_FUTURE} className="item">
            <List />
            <span>
              <Trans i18nKey="common:futureFishbowlList" components={{ i: <i /> }} />
            </span>
          </Link>
          <Link href={ROUTE_FISHBOWL_PAST} className="item">
            <CheckList />
            <span>
              <Trans i18nKey="common:pastFishbowlList" components={{ i: <i /> }} />
            </span>
          </Link>
          <Link href={ROUTE_EDIT_PROFILE} className="item">
            <Pencil />
            <span>{t('editProfile')}</span>
          </Link>
          <Link href={ROUTE_CHANGE_PASSWORD} className="item">
            <Lock />
            <span>{t('changePassword')}</span>
          </Link>
          <button className="item" onClick={logout}>
            <Logout />
            <span>{t('signout')}</span>
          </button>
        </Dropdown>
      )}
    </AvatarStyled>
  );
};

export default Avatar;
