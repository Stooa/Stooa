/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// import { useState } from 'react';
import { useJitsiStore } from '@/stores';
import useEventListener from '@/hooks/useEventListener';

import tracksRepository from '@/jitsi/Tracks';
import seatsRepository from '@/jitsi/Seats';
import { Participant } from '@/types/participant';

type UseJitsiFoo = {
  joinUser: (id: string | null | undefined, user?: Participant) => void;
  leaveUser: (id?: string) => void;
  sendJoinEvent: (user: Participant) => void;
  sendLeaveEvent: () => void;
};

export const JITSI_USER_JOIN = 'JITSI_USER_JOIN';
export const JITSI_USER_LEAVE = 'JITSI_USER_LEAVE';

export const useJitsiFoo = (): UseJitsiFoo => {
  const { conference, isJoined } = useJitsiStore();

  const joinUser = (id: string | null | undefined, user?: Participant) => {
    if (!conference) return;

    if (id === undefined || id === null) {
      id = conference.myUserId();
    }
    const seat = seatsRepository.join(id);
    tracksRepository.createTracks(id, seat, user);
    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] Join', id);
  };

  const leaveUser = (id?: string) => {
    if (!conference) return;

    if (id === undefined) {
      id = conference.myUserId();
    }

    seatsRepository.leave(id);
    tracksRepository.removeTracks(id);

    conference.selectParticipants(seatsRepository.getIds());

    console.log('[STOOA] User leave', id);
  };

  const sendJoinEvent = (user: Participant) => {
    if (isJoined && conference) {
      conference.setLocalParticipantProperty('joined', 'yes');

      joinUser(null, user);
    }
  };

  const sendLeaveEvent = () => {
    if (isJoined && conference) {
      conference.setLocalParticipantProperty('joined', 'no');

      leaveUser();
    }
  };

  useEventListener(JITSI_USER_JOIN, ({ id }) => {
    joinUser(id);
  });

  useEventListener(JITSI_USER_JOIN, ({ id }) => {
    leaveUser(id);
  });

  return { joinUser, leaveUser, sendJoinEvent, sendLeaveEvent };
};
