/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import seatsRepository from '@/jitsi/Seats';
import conferenceRepository from '@/jitsi/Conference';
import sharedTrackRepository from '@/jitsi/SharedTrack';
import { TRACK_ADDED } from '@/jitsi/Events';
import { dispatchEvent } from '@/lib/helpers';
import { MediaType } from '@/types/jitsi/media';

const tracksRepository = () => {
  let tracks = [];

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

    const seat = seatsRepository.getSeat();

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
    console.log('ENTRA TRACK', track);
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
    const ids = seatsRepository.getIds();

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];

      if (tracks[id] === undefined) continue;

      for (let index = 0; index < tracks[id].length; index++) {
        const trackHtml = _getTrackHtml(tracks[id][index]);

        if (trackHtml !== null) {
          _playTrackHtml(trackHtml);
        }
      }
    }
  };

  const createTracks = async (id, seat, user) => {
    if (tracks[id] === undefined) return;

    for (let index = 0; index < tracks[id].length; index++) {
      const track = tracks[id][index];
      const trackType = track.getType();

      if (trackType === 'audio' && user?.audioMuted) {
        await tracks[id][index].mute();
      } else if (trackType === 'video' && user?.videoMuted) {
        await tracks[id][index].mute();
      }

      _create(seat, track, user);
    }

    console.log('[STOOA] Html tracks created', id);
  };

  const removeTracks = id => {
    if (id === undefined) {
      id = conferenceRepository.getMyUserId();
    }

    if (tracks[id] === undefined) return;

    for (let index = 0; index < tracks[id].length; index++) {
      _remove(tracks[id][index]);
    }

    console.log('[STOOA] Html tracks removed', id);
  };

  const disposeTracks = async id => {
    if (id === undefined) {
      id = conferenceRepository.getMyUserId();
    }

    if (tracks[id] === undefined) return;

    for (let index = 0; index < tracks[id].length; index++) {
      await tracks[id][index].dispose();
    }

    console.log('[STOOA] Tracks disposed', id);
  };

  const _videoTypeChanged = (videoType, track) => {
    if (track.getVideoType() === MediaType.DESKTOP) {
      _videoAudioTrackRemoved(track);
      sharedTrackRepository.shareTrackAdded(track);
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
      sharedTrackRepository.shareTrackAdded(track);
    } else {
      _videoAudioTrackAdded(track);
    }
  };

  const _videoAudioTrackAdded = track => {
    const id = track.getParticipantId();

    if (tracks[id] === undefined) {
      tracks[id] = [];
    }

    tracks[id].push(track);

    let seat;

    seat = seatsRepository.getSeat(id);

    _create(seat, track);

    dispatchEvent(TRACK_ADDED, { track });
  };

  const handleTrackRemoved = track => {
    console.log('[STOOA] Handle track removed', track);

    if (track.getVideoType() === MediaType.DESKTOP) {
      sharedTrackRepository.removeShareTrack(track);
    } else {
      _videoAudioTrackRemoved(track);
    }
  };

  const _videoAudioTrackRemoved = track => {
    if (track.isLocal()) return;

    const id = track.getParticipantId();
    const seat = seatsRepository.getSeat(id);

    if (seat > 0) {
      _remove(track);
    }

    if (tracks[id] === undefined) return;

    tracks[id] = tracks[id].filter(remoteTrack => track !== remoteTrack);

    console.log('[STOOA] Handle camera or video track removed', track, seat);
  };

  const handleTrackMuteChanged = async track => {
    await syncLocalStorageTrack(track);

    if (track.isLocal()) return;

    const seat = seatsRepository.getSeat(track.getParticipantId());

    handleElementsMutedClass(seat, track);

    console.log('[STOOA] Handle track mute changed', track);
  };

  const toggleMute = async type => {
    const userId = conferenceRepository.getMyUserId();
    const seat = seatsRepository.getSeat(userId);
    const userTracks = tracks[userId];

    if (userTracks === undefined) return;

    if (seat > 0) {
      for (let index = 0; index < userTracks.length; index++) {
        const track = userTracks[index];
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
    const userTracks = tracks[id];

    if (userTracks === undefined) return;

    return tracksAreMuted(userTracks, type);
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

  const getAudioTracks = () => {
    const audioTracks = [];
    const ids = conferenceRepository.getParticipantsIds();

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];

      if (tracks[id] === undefined) continue;

      for (let index = 0; index < tracks[id].length; index++) {
        if (tracks[id][index].type === 'audio') {
          audioTracks.push(tracks[id][index]);
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

export default tracksRepository();
