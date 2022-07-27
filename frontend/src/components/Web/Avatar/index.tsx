/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_EDIT_PROFILE, ROUTE_CHANGE_PASSWORD, ROUTE_FISHBOWL_LIST } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import AvatarIcon from '@/ui/svg/avatar.svg';
import ChevronDown from '@/ui/svg/chevron-down.svg';
import Logout from '@/ui/svg/logout.svg';
import Lock from '@/ui/svg/lock.svg';
import Pencil from '@/ui/svg/pencil.svg';
import List from '@/ui/svg/list.svg';
import { Avatar as AvatarStyled, Dropdown } from '@/components/Web/Avatar/styles';
import Trans from 'next-translate/Trans';

const Avatar: React.FC = () => {
  const wrapperRef = useRef(null);
  const [active, setActive] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation('common');

  const toggleDropdown = useCallback(() => setActive(!active), [active]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (active && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        toggleDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, active, toggleDropdown]);

  return (
    <AvatarStyled ref={wrapperRef}>
      <button
        className={`avatar medium body-sm ${active ? 'active' : ''}`}
        onClick={toggleDropdown}
      >
        <AvatarIcon />
        <span>{user.name}</span>
        <ChevronDown />
      </button>
      {active && (
        <Dropdown>
          <Link href={ROUTE_FISHBOWL_LIST} passHref>
            <a className="item">
              <List />
              <span>
                <Trans i18nKey="common:fishbowlList" components={{ i: <i /> }} />
              </span>
            </a>
          </Link>
          <Link href={ROUTE_EDIT_PROFILE} passHref>
            <a className="item">
              <Pencil />
              <span>{t('editProfile')}</span>
            </a>
          </Link>
          <Link href={ROUTE_CHANGE_PASSWORD} passHref>
            <a className="item">
              <Lock />
              <span>{t('changePassword')}</span>
            </a>
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
