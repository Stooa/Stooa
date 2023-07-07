/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import useEventListener from '@/hooks/useEventListener';
import { pushEventDataLayer } from '@/lib/analytics';
import { SCREEN_SHARE_CANCELED, SCREEN_SHARE_START, SCREEN_SHARE_STOP } from '@/jitsi/Events';
import { useSharedTrack } from '@/jitsi/useSharedTrack';
import { useConference, useDevices } from '@/jitsi';

const useScreenShare = (isModerator: boolean) => {
  const { screenShare } = useDevices();
  const { getLocalTracks } = useConference();
  const { exitFullScreen, removeShareTrack } = useSharedTrack();
  const [isSharing, setIsSharing] = useState(false);

  const share = async (): Promise<void> => {
    pushEventDataLayer({
      action: 'click_share',
      category: 'Sharescreen',
      label: window.location.href
    });

    const selectedScreen = await screenShare();

    if (selectedScreen) {
      pushEventDataLayer({
        action: 'share',
        category: 'Sharescreen',
        label: window.location.href
      });

      setIsSharing(true);
    }
  };

  const stopShare = async (): Promise<void> => {
    const shareLocalTrack = getLocalTracks().filter(track => track.getVideoType() === 'desktop');

    setIsSharing(false);

    await removeShareTrack(shareLocalTrack[0], 'app');
  };

  useEventListener(SCREEN_SHARE_START, () => {
    setIsSharing(true);
  });

  useEventListener(SCREEN_SHARE_STOP, ({ detail: { location } }) => {
    if (isModerator) {
      pushEventDataLayer({
        action: location === 'app' ? 'stooa_stop_share' : 'navigator_stop_share',
        category: 'Sharescreen',
        label: window.location.href
      });
    }

    exitFullScreen();

    setIsSharing(false);
  });

  useEventListener(SCREEN_SHARE_CANCELED, () => {
    setIsSharing(false);
  });

  return { isSharing, share, stopShare };
};

export default useScreenShare;
