/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import userRepository from '@/jitsi/User';
import conferenceRepository from '@/jitsi/Conference';
import seatsRepository from '@/jitsi/Seats';
import dynamic from 'next/dynamic';

const JitsiMeetJS = dynamic(() => import('lib-jitsi-meet'), { ssr: false });

const localTracksRepository = () => {
  const _handleAudioLevelChanged = audioLevel => {
    console.log('[STOOA] Local audio level changed', audioLevel);
  };

  const _handleTrackMuteChanged = track => {
    console.log('[STOOA] Local mute change', track.isMuted(), track);
  };

  const _handleLocalTrackStopped = () => {
    console.log('[STOOA] Local track stopped');
  };

  const _handleAudioOutputChanged = deviceId => {
    console.log('[STOOA] Local audio output changed', deviceId);
  };

  const _addTracks = tracks => {
    const {
      events: {
        track: {
          TRACK_AUDIO_LEVEL_CHANGED,
          TRACK_MUTE_CHANGED,
          LOCAL_TRACK_STOPPED,
          TRACK_AUDIO_OUTPUT_CHANGED
        }
      }
    } = JitsiMeetJS;

    tracks.forEach(track => {
      track.addEventListener(TRACK_AUDIO_LEVEL_CHANGED, _handleAudioLevelChanged);
      track.addEventListener(TRACK_MUTE_CHANGED, _handleTrackMuteChanged);
      track.addEventListener(LOCAL_TRACK_STOPPED, _handleLocalTrackStopped);
      track.addEventListener(TRACK_AUDIO_OUTPUT_CHANGED, _handleAudioOutputChanged);
    });

    console.log('[STOOA] Add local tracks', tracks);

    return tracks;
  };

  const createLocalTrack = async (kind, deviceId) => {
    let options = {
      devices: [kind],
      firePermissionPromptIsShownEvent: true,
      fireSlowPromiseEvent: true
    };

    if (deviceId !== undefined) {
      const deviceType = kind === 'audio' ? 'micDeviceId' : 'cameraDeviceId';

      options[deviceType] = deviceId;
    }

    console.log('[STOOA] Created local track', kind, deviceId);

    return JitsiMeetJS.createLocalTracks(options)
      .then(_addTracks)
      .catch(error => {
        console.log('[STOOA] Error creating local track', kind, error.message);

        if (kind === 'video') {
          deleteLocalVideo();
        }

        return Promise.reject(error);
      });
  };

  const createLocalTracks = async () => {
    const micDeviceId = userRepository.getUserAudioInput()?.deviceId;
    const cameraDeviceId = userRepository.getUserVideoInput()?.deviceId;

    return JitsiMeetJS.createLocalTracks({
      devices: ['audio', 'video'],
      micDeviceId,
      cameraDeviceId,
      firePermissionPromptIsShownEvent: true,
      fireSlowPromiseEvent: true
    })
      .then(_addTracks)
      .catch(() => {
        console.log('[STOOA] Video and audio failed, trying only audio');

        return createLocalTrack('audio', micDeviceId);
      })
      .catch(() => {
        console.log('[STOOA] Audio failed, trying only video');

        return createLocalTrack('video', cameraDeviceId);
      })
      .catch(error => {
        console.log('[STOOA] All attempts creating local tracks failed', error.message);

        return Promise.reject(error);
      });
  };

  const deleteLocalVideo = () => {
    const userId = conferenceRepository.getMyUserId();
    const seatNumber = seatsRepository.getSeat(userId);

    if (seatNumber > 0) {
      const seatHtml = document.getElementById(`seat-${seatNumber}`);
      seatHtml.querySelector('video').remove();
    }
  };

  return { createLocalTrack, createLocalTracks };
};

export default localTracksRepository();
