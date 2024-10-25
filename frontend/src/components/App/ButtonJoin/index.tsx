/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react';

import { User } from '@/types/user';
import { pushEventDataLayer } from '@/lib/analytics';

import ArrowDownIcon from '@/ui/svg/arrow-down.svg';
import ArrowUpIcon from '@/ui/svg/arrow-up.svg';
import PermissionsAlert from '@/ui/svg/permissions-alert.svg';
import StyledButton from '@/components/App/ButtonJoin/styles';
import { useDevices } from '@/contexts/DevicesContext';
import { useStateValue } from '@/contexts/AppContext';
import { IConferenceStatus } from '@/jitsi/Status';
import { isTimeLessThanNSeconds } from '@/lib/helpers';
import { useUser } from '@/jitsi';

interface Props {
  join: (user: User) => void;
  leave: () => void;
  joined: boolean;
  disabled: boolean;
  permissions: boolean;
  children: React.ReactNode;
}

const ButtonJoin = ({ joined, join, leave, disabled, permissions, children }: Props) => {
  const [active, setActive] = useState(true);
  const { setShowModalPermissions } = useDevices();
  const [{ conferenceStatus, isGuest }] = useStateValue();
  const trackFailJoin = useRef<boolean>();
  const joinedTimestamp = useRef<number>();
  const { getUser } = useUser();

  const handleJoinClick = async () => {
    if (!permissions) {
      setShowModalPermissions(true);
      return;
    }

    pushEventDataLayer({
      action: joined ? 'Leave' : 'Join',
      category: 'Buttons',
      label: window.location.href
    });

    const userSettings = getUser();

    setActive(false);
    joined ? leave() : join(userSettings);
    setActive(true);
  };

  useEffect(() => {
    if (conferenceStatus === IConferenceStatus.RUNNING && isGuest) {
      pushEventDataLayer({
        action: 'Connect',
        category: 'Fail join'
      });

      setTimeout(() => {
        trackFailJoin.current = true;
      }, 15000);
    }
  }, [conferenceStatus, isGuest]);

  useEffect(() => {
    if (trackFailJoin.current && joined) {
      joinedTimestamp.current = Date.now();
    }

    if (
      trackFailJoin.current &&
      joinedTimestamp.current &&
      !joined &&
      isTimeLessThanNSeconds(new Date(joinedTimestamp.current), 15)
    ) {
      pushEventDataLayer({
        action: 'Failed',
        category: 'Fail join',
        label: 'Early fail join'
      });
    }
  }, [joined]);

  return (
    <StyledButton
      id="button-join"
      className={`medium ${joined ? 'joined' : ''}`}
      onClick={handleJoinClick}
      disabled={disabled}
      active={active}
    >
      <div className="button">
        {!permissions && (
          <div className="alert" data-testid="permission-alert">
            <PermissionsAlert />
          </div>
        )}
        {joined ? (
          <ArrowDownIcon data-testid="arrow-down" />
        ) : (
          <ArrowUpIcon data-testid="arrow-up" />
        )}
      </div>
      <div className="text">{children}</div>
    </StyledButton>
  );
};

export default ButtonJoin;
