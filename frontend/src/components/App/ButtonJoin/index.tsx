/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';

import { User } from '@/types/user';
import { pushEventDataLayer } from '@/lib/analytics';
import userRepository from '@/lib/jitsi-modules/User';

import ArrowDownIcon from '@/ui/svg/arrow-down.svg';
import ArrowUpIcon from '@/ui/svg/arrow-up.svg';
import Button from '@/components/App/ButtonJoin/styles';

interface Props {
  join: (user: User) => void;
  leave: () => void;
  joined: boolean;
  disabled: boolean;
}

const ButtonJoin: React.FC<Props> = ({ joined, join, leave, disabled, children }) => {
  const [active, setActive] = useState(true);

  const handleJoinClick = async () => {
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

  return (
    <Button
      className={`text-sm medium ${joined ? 'joined' : ''}`}
      onClick={handleJoinClick}
      disabled={disabled}
      active={active}>
      <div className="button">{joined ? <ArrowDownIcon /> : <ArrowUpIcon />}</div>
      <div className="text">{children}</div>
    </Button>
  );
};

export default ButtonJoin;
