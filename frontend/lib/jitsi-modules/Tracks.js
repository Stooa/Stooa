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

const tracksRepository = () => {
  let tracks = [];

  const _playTrackHtml = trackHtml => {
    trackHtml.play().then(() => {
      console.log('[STOOA] Playing track', trackHtml.id);
    }).catch(error => {
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

  const syncSessionStorageTrack = async (track, user) => {
    const trackType = track.getType();

    if (!user) {
      user = JSON.parse(sessionStorage.getItem('user'));
    }

    if (user && track.isLocal()) {
      const userIsMuted = trackType === 'video' ? user.videoMuted : user.audioMuted;

      // This is checking also the user
      if (track.isMuted() && !userIsMuted) {
        await track.unmute().then(() => {
          console.log('[STOOA] Track unmuted', track.getParticipantId() + trackType);
          return track;
        });
      } else if (!track.isMuted() && userIsMuted) {
        await track.mute().then(() => {
          console.log('[STOOA] Track unmuted', track.getParticipantId() + trackType);
          return track;
        });
      }
    }
  };

  const _create = async (seat, track, user) => {
    const trackType = track.getType();
    const trackHtml = document.createElement(trackType);

    if(!track.isLocalAudioTrack()){
      trackHtml.autoplay = true;
    }

    trackHtml.id = track.getParticipantId() + trackType;

    if (track.isLocal()) trackHtml.classList.add('is-local');
    if (trackType === 'video') {
      trackHtml.setAttribute('muted', '');
      trackHtml.setAttribute('playsinline', '');
    }

    await syncSessionStorageTrack(track, user);

    const seatHtml = handleElementsMutedClass(seat, track);
    seatHtml.appendChild(trackHtml);
    track.attach(trackHtml);

    if(!track.isLocalAudioTrack()){
      _playTrackHtml(trackHtml);
    }
  };

  const _remove = track => {
    const trackHtml = _getTrackHtml(track);

    if (trackHtml !== null) {
      if (track.isLocal() && !track.isMuted()) {
        track.mute().then(() => {
          console.log('[STOOA] Track muted', track.getParticipantId() + track.getType());
        });
      }

      track.detach(trackHtml);
      trackHtml.parentNode.removeChild(trackHtml);
    }
  };

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

  const handleTrackAdded = track => {
    const id = track.getParticipantId();

    if (tracks[id] === undefined) {
      tracks[id] = [];
    }

    tracks[id].push(track);

    const seat = seatsRepository.getSeat(id);

    if (seat > 0) {
      _create(seat, track);
    }

    console.log('[STOOA] Handle track added', track, seat);
  };

  const handleTrackRemoved = track => {
    const id = track.getParticipantId();
    const seat = seatsRepository.getSeat(id);

    if (seat > 0) {
      _remove(track);
    }

    if (tracks[id] === undefined) return;

    tracks[id] = tracks[id].filter(remoteTrack => track !== remoteTrack);

    console.log('[STOOA] Handle track removed', track, seat);
  };

  const handleTrackMuteChanged = async track => {
    await syncSessionStorageTrack(track)
    const mutedId = track.getParticipantId();
    const userId = conferenceRepository.getMyUserId();
    const seat = seatsRepository.getSeat(mutedId);

    if (mutedId === userId) return;

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

  return {
    createTracks,
    handleTrackAdded,
    handleTrackMuteChanged,
    handleTrackRemoved,
    isLocalParticipantMuted,
    isParticipantMuted,
    playTracks,
    removeTracks,
    toggleAudioTrack,
    toggleVideoTrack,
    syncSessionStorageTrack,
  };
};

export default tracksRepository();
