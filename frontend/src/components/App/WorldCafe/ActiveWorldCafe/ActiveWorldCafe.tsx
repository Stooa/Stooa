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
import { LOCALES } from '@/lib/supportedTranslationLanguages';
export const ActiveWorldCafe = () => {
  const { joinWorldCafe } = useJitsi();
  const { getUser } = useUser();
  const { joinConference } = useConference();
  const [conferenceReady, setConferenceReady] = useState(false);

  useEventListener(CONFERENCE_START, ({ detail: { myUserId } }) => {
    setConferenceReady(true);
  });

  useEventListener(CONNECTION_ESTABLISHED_FINISHED, () => {
    joinConference();
  });

  useEffect(() => {
    const handleJoin = async () => {
      const foo = await joinWorldCafe(getUser());
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
