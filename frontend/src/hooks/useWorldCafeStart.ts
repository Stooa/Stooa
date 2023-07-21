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
  const { joinConference } = useConference();

  const [conferenceReady, setConferenceReady] = useState(false);

  // TODO: FIRST TIME THAT HOST CONNECTS USE THIS SHIT `setStartMutedPolicy({audio: true, video: false})`

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    console.log('CONFERENCE_START', myUserId);
    setConferenceReady(true);
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
