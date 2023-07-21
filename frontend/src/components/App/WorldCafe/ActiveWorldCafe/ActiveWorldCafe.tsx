/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import VideoGrid from '../VideoGrid/VideoGrid';
import { useJitsi } from '@/lib/useJitsi';
import { useUser } from '@/jitsi/useUser';
import useEventListener from '@/hooks/useEventListener';
import { CONFERENCE_START, CONNECTION_ESTABLISHED_FINISHED } from '@/jitsi/Events';
import { useConference } from '@/jitsi';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';

export const ActiveWorldCafe = () => {
  const { setParticipant } = useWorldCafeStore();
  const { joinWorldCafe } = useJitsi();
  const { getUser } = useUser();
  const { joinConference } = useConference();
  const [conferenceReady, setConferenceReady] = useState(false);

  // TODO: FIRST TIME THAT HOST CONNECTS USE THIS SHIT `setStartMutedPolicy({audio: true, video: true})`

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    console.log('CONFERENCE_START', myUserId);
    setConferenceReady(true);
  });

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    joinConference();
  });

  useEventListener('WORLDCAFE_JOIN_FOO', ({ detail: { user } }) => {
    console.log('WORLDCAFE_JOIN_FOO', user);
  });

  useEffect(() => {
    const myUser = getUser();
    // console.log('myUser', myUser.id);

    const handleJoin = async () => {
      await joinWorldCafe(myUser);

      if (myUser.id) {
        setParticipant(myUser.id);
      }
    };

    if (conferenceReady) {
      handleJoin();
    }
  }, [conferenceReady]);

  return (
    <>
      <VideoGrid />
    </>
  );
};
