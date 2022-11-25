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
import { Track } from "@/types/jitsi/track";

const localTracksRepository = () => {
  const _handleAudioLevelChanged = (audioLevel: number): void => {
    console.log('[STOOA] Local audio level changed', audioLevel);
  };

  const _handleTrackMuteChanged = (track: Track): void => {
    console.log('[STOOA] Local mute change', track.isMuted(), track);
  };

  const _handleLocalTrackStopped = (): void => {
    console.log('[STOOA] Local track stopped');
  };

  const _handleAudioOutputChanged = (deviceId: string): void => {
    console.log('[STOOA] Local audio output changed', deviceId);
  };

  const _addListenersToHtmlTracks = (htmlTracks: HTMLTrackElement[]): HTMLTrackElement[] => {
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

    htmlTracks.forEach(htmlTrack => {
      htmlTrack.addEventListener(TRACK_AUDIO_LEVEL_CHANGED, _handleAudioLevelChanged);
      htmlTrack.addEventListener(TRACK_MUTE_CHANGED, _handleTrackMuteChanged);
      htmlTrack.addEventListener(LOCAL_TRACK_STOPPED, _handleLocalTrackStopped);
      htmlTrack.addEventListener(TRACK_AUDIO_OUTPUT_CHANGED, _handleAudioOutputChanged);
    });

    console.log('[STOOA] Add local tracks', htmlTracks);

    return htmlTracks;
  };

  const createLocalTrack = async (kind: string, deviceId?: string): Promise<Track[]> => {
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
      .then(_addListenersToHtmlTracks)
      .catch(error => {
        console.log('[STOOA] Error creating local track', kind, error.message);

        if (kind === 'video') {
          deleteLocalVideo();
        }

        return Promise.reject(error);
      });
  };

  const createScreenShareTracks = async (): Promise<Track[]> => {
    return JitsiMeetJS.createLocalTracks({
      devices: ['desktop']
    })
      .then(_addListenersToHtmlTracks)
      .catch(error => {
        console.log('[STOOA] All attempts creating local tracks failed', error.message);
        return Promise.reject(error);
      });
  }

  const createLocalTracks = async (): Promise<Track[]> => {
    const micDeviceId = userRepository?.getUserAudioInput()?.deviceId;
    const cameraDeviceId = userRepository?.getUserVideoInput()?.deviceId;

    return JitsiMeetJS.createLocalTracks({
      devices: ['audio', 'video'],
      micDeviceId,
      cameraDeviceId,
      firePermissionPromptIsShownEvent: true,
      fireSlowPromiseEvent: true
    })
      .then(_addListenersToHtmlTracks)
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

  const deleteLocalVideo = (): void => {
    const userId = conferenceRepository.getMyUserId();
    const seatNumber = seatsRepository.getSeat(userId);

    if (seatNumber > 0) {
      const seatHtml = document.getElementById(`seat-${seatNumber}`);
      seatHtml.querySelector('video').remove();
    }
  };

  return { createLocalTrack, createLocalTracks, createScreenShareTracks };
};

export default localTracksRepository();
