/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  CONFERENCE_START,
  CONFERENCE_START_MUTED,
  CONNECTION_ESTABLISHED_FINISHED,
  USER_LEFT_CONFERENCE
} from '@/jitsi/Events';
import useEventListener from './useEventListener';
import { useEffect, useState } from 'react';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { useJitsi } from '@/lib/useJitsi';
import { useUser } from '@/jitsi/useUser';
import { useConference } from '@/jitsi/useConference';

export const useWorldCafeStart = () => {
  const { addWorldCafeParticipant, removeWorldCafeParticipant } = useWorldCafeStore(store => ({
    addWorldCafeParticipant: store.addWorldCafeParticipant,
    removeWorldCafeParticipant: store.removeWorldCafeParticipant
  }));
  const { joinWorldCafe } = useJitsi();
  const { getUser } = useUser();
  const { joinConference, muteAudioConference } = useConference();

  const [conferenceReady, setConferenceReady] = useState(false);

  useEventListener(CONFERENCE_START_MUTED, () => {
    muteAudioConference();
  });

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    setConferenceReady(true);
    console.log('[Stooa] Conference started', myUserId);
  });

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    joinConference();
  });

  useEventListener(USER_LEFT_CONFERENCE, ({ detail: { user } }) => {
    removeWorldCafeParticipant(user._id);
  });

  useEffect(() => {
    const myUser = getUser();

    const handleJoin = async () => {
      await joinWorldCafe(myUser);

      if (myUser.id) {
        addWorldCafeParticipant(myUser.id);
      }
    };

    if (conferenceReady) {
      handleJoin();
    }
  }, [conferenceReady]);

  return { conferenceReady };
};
