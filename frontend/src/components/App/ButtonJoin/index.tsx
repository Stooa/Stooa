/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState } from 'react';

import { User } from '@/types/user';
import { pushEventDataLayer } from '@/lib/analytics';
import userRepository from '@/jitsi/User';

import ArrowDownIcon from '@/ui/svg/arrow-down.svg';
import ArrowUpIcon from '@/ui/svg/arrow-up.svg';
import PermissionsAlert from '@/ui/svg/permissions-alert.svg';
import StyledButton from '@/components/App/ButtonJoin/styles';
import { useDevices } from '@/contexts/DevicesContext';
import conferenceRepository from '@/jitsi/Conference';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import { IConferenceStatus } from '@/jitsi/Status';
import { isTimeLessThanNSeconds } from '@/lib/helpers';

interface Props {
  join: (user: User) => void;
  leave: () => void;
  joined: boolean;
  disabled: boolean;
  permissions: boolean;
}

const ButtonJoin: React.FC<Props> = ({ joined, join, leave, disabled, permissions, children }) => {
  const [active, setActive] = useState(true);
  const { setShowModalPermissions } = useDevices();
  const [{ conferenceStatus, isGuest }] = useStateValue();
  const trackFailJoin = useRef<boolean>();
  const joinedTimestamp = useRef<number>();

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

    const userSettings = userRepository.getUser();

    setActive(false);
    joined ? leave() : join(userSettings);
    setActive(true);
  };

  useEffect(() => {
    if (conferenceStatus === IConferenceStatus.RUNNING && isGuest) {
      console.log('FAIL JOIN -- CONNECT');

      setTimeout(() => {
        trackFailJoin.current = true;
      }, 10000);
    }
  }, [conferenceStatus]);

  useEffect(() => {
    if (trackFailJoin.current && joined) {
      joinedTimestamp.current = Date.now();
    }

    if (
      trackFailJoin.current &&
      !joined &&
      isTimeLessThanNSeconds(new Date(joinedTimestamp.current), 15)
    ) {
      console.log('FAIL JOIN --> Early fail join');
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
          <div className="alert">
            <PermissionsAlert />
          </div>
        )}
        {joined ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </div>
      <div className="text">{children}</div>
    </StyledButton>
  );
};

export default ButtonJoin;
