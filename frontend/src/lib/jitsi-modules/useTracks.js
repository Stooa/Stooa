/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useConference, useSeats, useSharedTracks } from '@/jitsi';
import { TRACK_ADDED } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';
import { MediaType } from '@/types/jitsi/media';
import { useJitsiStore } from '@/store';

export const useTracks = () => {
  const { getMyUserId } = useConference();
  const { getSeat, getIds } = useSeats();
  const { shareTrackAdded, removeShareTrack } = useSharedTracks();
  const { getTracksByUser, addUserTrack, removeUserTrack } = useJitsiStore();

  const _playTrackHtml = trackHtml => {
    trackHtml
      .play()
      .then(() => {
        console.log('[STOOA] Playing track', trackHtml.id);
      })
      .catch(error => {
        console.log('[STOOA] Problem with auto play', error);
      });
  };

  const _getTrackHtml = track => {
    return document.getElementById(track.getParticipantId() + track.getType());
  };

  const handleElementsMutedClass = (seat, track) => {
    const type = track.getType();
    const seatHtml = document.getElementById(`seat-${seat}`);
    const toggleClass = `user-muted-${type}`;

    if (seat > 0 && seatHtml) {
      if (track.isMuted()) {
        seatHtml.classList.add(toggleClass);
      } else {
        seatHtml.classList.remove(toggleClass);
      }

      return seatHtml;
    }

    return null;
  };

  const syncLocalStorageTrack = async (track, user) => {
    if (!user) {
      user = JSON.parse(localStorage.getItem('user'));
    }

    const seat = getSeat();

    if (user && seat > 0 && track.isLocal()) {
      const trackType = track.getType();
      const userIsMuted = trackType === 'video' ? user.videoMuted : user.audioMuted;

      // This is checking also the user
      if (track.isMuted() && !userIsMuted) {
        await track.unmute().then(() => {
          console.log('[STOOA] Track unmuted', track.getParticipantId() + trackType);
        });
      } else if (!track.isMuted() && userIsMuted) {
        await track.mute().then(() => {
          console.log('[STOOA] Track muted ', track.getParticipantId() + trackType);
        });
      }
    }
  };

  const _create = async (seat, track, user) => {
    const trackType = track.getType();
    const trackHtml = document.createElement(trackType);

    if (!track.isLocalAudioTrack()) {
      trackHtml.autoplay = true;
    }

    trackHtml.id = track.getParticipantId() + trackType;

    if (track.isLocal()) trackHtml.classList.add('is-local');

    await syncLocalStorageTrack(track, user);

    const seatHtml = handleElementsMutedClass(seat, track);

    if (!seatHtml) return;

    if (trackType === 'video') {
      trackHtml.setAttribute('muted', '');
      trackHtml.setAttribute('playsinline', '');
      if (seatHtml) {
        seatHtml.querySelector('.video-wrapper').appendChild(trackHtml);
      }
    } else {
      seatHtml.appendChild(trackHtml);
    }
    track.attach(trackHtml);

    if (!track.isLocalAudioTrack()) {
      _playTrackHtml(trackHtml);
    }
  };

  const _remove = track => {
    const trackHtml = _getTrackHtml(track);

    if (trackHtml !== null) {
      if (track.isLocal() && !track.isMuted()) {
        track.mute().then(() => {
          console.log(
            '[STOOA] Track muted (from remove) ',
            track.getParticipantId() + track.getType()
          );
        });
      }

      track.detach(trackHtml);
      trackHtml.parentNode.removeChild(trackHtml);
    }
  };

  // TO-DO: play shared tracks
  const playTracks = () => {
    const ids = getIds();

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];

      const tracks = getTracksByUser(id);

      if (tracks === undefined) continue;

      for (let index = 0; index < track.length; index++) {
        const trackHtml = _getTrackHtml(track[index]);

        if (trackHtml !== null) {
          _playTrackHtml(trackHtml);
        }
      }
    }
  };

  const createTracks = async (id, seat, user) => {
    const tracks = getTracksByUser(id);

    if (tracks === undefined) return;

    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      const trackType = track.getType();

      if (trackType === 'audio' && user?.audioMuted) {
        await tracks[index].mute();
      } else if (trackType === 'video' && user?.videoMuted) {
        await tracks[index].mute();
      }

      _create(seat, track, user);
    }

    console.log('[STOOA] Html tracks created', id);
  };

  const removeTracks = id => {
    if (id === undefined) {
      id = getMyUserId();
    }

    const tracks = getTracksByUser(id);

    if (tracks === undefined) return;

    for (let index = 0; index < tracks.length; index++) {
      _remove(tracks[index]);
    }

    console.log('[STOOA] Html tracks removed', id);
  };

  const disposeTracks = async id => {
    if (id === undefined) {
      id = getMyUserId();
    }

    const tracks = getTracksByUser(id);

    if (tracks === undefined) return;

    for (let index = 0; index < tracks.length; index++) {
      await tracks[index].dispose();
    }

    console.log('[STOOA] Tracks disposed', id);
  };

  const _videoTypeChanged = (videoType, track) => {
    if (track.getVideoType() === MediaType.DESKTOP) {
      _videoAudioTrackRemoved(track);
      shareTrackAdded(track);
    }

    console.log('[STOOA] video type change', track, videoType);
  };

  const handleTrackAdded = track => {
    console.log('[STOOA] Handle track added', track);

    const {
      events: {
        track: { TRACK_VIDEOTYPE_CHANGED }
      }
    } = JitsiMeetJS;

    track.addEventListener(TRACK_VIDEOTYPE_CHANGED, videoType =>
      _videoTypeChanged(videoType, track)
    );

    if (track.getVideoType() === MediaType.DESKTOP) {
      shareTrackAdded(track);
    } else {
      _videoAudioTrackAdded(track);
    }
  };

  const _videoAudioTrackAdded = track => {
    const id = track.getParticipantId();

    addUserTrack(id, track);

    const seat = getSeat(id);

    _create(seat, track);

    dispatchEvent(TRACK_ADDED, { track });
  };

  const handleTrackRemoved = track => {
    console.log('[STOOA] Handle track removed', track);

    if (track.getVideoType() === MediaType.DESKTOP) {
      removeShareTrack(track);
    } else {
      _videoAudioTrackRemoved(track);
    }
  };

  const _videoAudioTrackRemoved = track => {
    if (track.isLocal()) return;

    const id = track.getParticipantId();
    const seat = getSeat(id);

    if (seat > 0) {
      _remove(track);
    }

    removeUserTrack(id, track);

    console.log('[STOOA] Handle camera or video track removed', track, seat);
  };

  const handleTrackMuteChanged = async track => {
    await syncLocalStorageTrack(track);

    if (track.isLocal()) return;

    const seat = getSeat(track.getParticipantId());

    handleElementsMutedClass(seat, track);

    console.log('[STOOA] Handle track mute changed', track);
  };

  const toggleMute = async type => {
    const userId = getMyUserId();
    const seat = getSeat(userId);
    const tracks = getTracksByUser(userId);

    if (tracks === undefined) return;

    if (seat > 0) {
      for (let index = 0; index < tracks.length; index++) {
        const track = tracks[index];
        const trackIsMuted = track.isMuted();

        if (track.getType() === type) {
          if (trackIsMuted)
            await track.unmute().then(() => {
              setTimeout(() => {
                handleElementsMutedClass(seat, track);
              }, 500);
            });
          else {
            await track.mute().then(() => {
              handleElementsMutedClass(seat, track);
            });
          }
        }
      }
    }
  };

  const toggleAudioTrack = () => toggleMute('audio');
  const toggleVideoTrack = () => toggleMute('video');

  const isLocalParticipantMuted = (id, type) => {
    const tracks = getTracksByUser(id);

    return tracksAreMuted(tracks, type);
  };

  const isParticipantMuted = (participant, type) => {
    const tracks = participant.getTracks();

    return tracksAreMuted(tracks, type);
  };

  const tracksAreMuted = (tracks, type) => {
    for (let index = 0; index < tracks.length; index++) {
      if (tracks[index].type === type) {
        return tracks[index].isMuted();
      }
    }

    return false;
  };

  const getAudioTracks = (ids) => {
    const audioTracks = [];

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const tracks = getTracksByUser(id);

      for (let index = 0; index < tracks.length; index++) {
        if (tracks[index].type === 'audio') {
          audioTracks.push(tracks[index]);
        }
      }
    }

    return audioTracks;
  };

  return {
    createTracks,
    handleTrackAdded,
    handleTrackMuteChanged,
    handleTrackRemoved,
    isLocalParticipantMuted,
    isParticipantMuted,
    playTracks,
    removeTracks,
    disposeTracks,
    toggleAudioTrack,
    toggleVideoTrack,
    syncLocalStorageTrack,
    getAudioTracks
  };
};
