/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import Button from '@/components/Common/Button';
import { User } from '@/types/user';
import { kickParticipant } from '@/lib/jitsi';

interface Props {
  participant: User;
}

const HostActions: React.FC<Props> = ({ participant, children }) => {
  const kick = () => {
    kickParticipant(participant.id, 'reason');
  };

  return (
    <Button variant="secondary" className="never-full" onClick={kick}>
      <span>Kick</span>
    </Button>
  );
};

export default HostActions;
