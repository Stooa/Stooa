/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiLocalTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiLocalTrack';

const sharedTrackRepository = () => {
  let shareTrack: JitsiLocalTrack | null;

  const getShareHtmlTrack = (): HTMLElement | null => {
    return document.getElementById('share');
  };

  const _createShareTrack = async track => {
    const videoType = track.getVideoType();
    if (videoType !== 'desktop') {
      return;
    }

    const seatHtml = document.getElementById('share');
    const trackHtml = document.createElement('video');

    if (!seatHtml && trackHtml) {
      return;
    }

    trackHtml.autoplay = true;
    trackHtml.id = track.getParticipantId() + videoType;

    trackHtml.setAttribute('muted', '');
    trackHtml.setAttribute('playsinline', '');
    seatHtml?.appendChild(trackHtml);

    track.attach(trackHtml);
    // _playTrackHtml(trackHtml);
  };

  const shareTrackAdded = track => {
    shareTrack = track;

    _createShareTrack(shareTrack);
  };

  const removeShareTrack = track => {
    if (!track) return;

    const trackHtml = getShareHtmlTrack();
    shareTrack = null;

    track.dispose();

    if (trackHtml && trackHtml.firstChild) {
      track.detach(trackHtml);
      trackHtml.removeChild(trackHtml.firstChild);
    }

    console.log('[STOOA] Html tracks removed');
  };

  return {
    shareTrackAdded,
    removeShareTrack
  };
};

export default sharedTrackRepository();
