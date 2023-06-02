/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import JitsiLocalTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiLocalTrack';
import { useUser, useSeats, useSharedTrack } from '@/jitsi';
import { dispatchEvent } from '@/lib/helpers';
import { SCREEN_SHARE_CANCELED, SCREEN_SHARE_PERMISSIONS_DENIED } from '@/jitsi/Events';
import { MediaType } from '@/types/jitsi/media';
import { useJitsiStore } from '@/store';

export const useLocalTracks = () => {
  const { getUserAudioInput, getUserVideoInput } = useUser();
  const { getSeat } = useSeats();
  const { removeShareTrack } = useSharedTrack();
  const { userId } = useJitsiStore();

  const _handleAudioLevelChanged = (audioLevel: number): void => {
    console.log('[STOOA] Local audio level changed', audioLevel);
  };

  const _handleTrackMuteChanged = (track: JitsiLocalTrack): void => {
    console.log('[STOOA] Local mute change', track.isMuted(), track);
  };

  const _handleLocalTrackStopped = (track: JitsiLocalTrack): void => {
    if (track && track.getVideoType() === 'desktop') {
      removeShareTrack(track);
    }
    console.log('[STOOA] Local track stopped', track);
  };

  const _handleAudioOutputChanged = (deviceId: string): void => {
    console.log('[STOOA] Local audio output changed', deviceId);
  };

  const _handleVideoTypeChanged = (track: JitsiLocalTrack): void => {
    console.log('[STOOA] Local video type changed', track);
  };

  const _addListenersToHtmlTracks = (htmlTracks: HTMLTrackElement[]): HTMLTrackElement[] => {
    const {
      events: {
        track: {
          TRACK_AUDIO_LEVEL_CHANGED,
          TRACK_MUTE_CHANGED,
          LOCAL_TRACK_STOPPED,
          TRACK_AUDIO_OUTPUT_CHANGED,
          TRACK_VIDEOTYPE_CHANGED
        }
      }
    } = JitsiMeetJS;

    htmlTracks.forEach(htmlTrack => {
      htmlTrack.addEventListener(TRACK_AUDIO_LEVEL_CHANGED, _handleAudioLevelChanged);
      htmlTrack.addEventListener(TRACK_MUTE_CHANGED, _handleTrackMuteChanged);
      htmlTrack.addEventListener(LOCAL_TRACK_STOPPED, _handleLocalTrackStopped);
      htmlTrack.addEventListener(TRACK_AUDIO_OUTPUT_CHANGED, _handleAudioOutputChanged);
      htmlTrack.addEventListener(TRACK_VIDEOTYPE_CHANGED, _handleVideoTypeChanged);
    });

    console.log('[STOOA] Add local tracks', htmlTracks);

    return htmlTracks;
  };

  const createLocalTrack = async (
    kind: MediaType,
    deviceId?: string
  ): Promise<JitsiLocalTrack[]> => {
    const options = {
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

        if (kind === MediaType.DESKTOP) {
          if (error.name === 'gum.permission_denied') {
            dispatchEvent(SCREEN_SHARE_PERMISSIONS_DENIED);
            return;
          }
          dispatchEvent(SCREEN_SHARE_CANCELED);
          return;
        }

        if (kind === MediaType.VIDEO) {
          deleteLocalVideo();
        }

        return Promise.reject(error);
      });
  };

  const createLocalTracks = async (): Promise<JitsiLocalTrack[]> => {
    const micDeviceId = getUserAudioInput()?.deviceId;
    const cameraDeviceId = getUserVideoInput()?.deviceId;

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

        return createLocalTrack(MediaType.AUDIO, micDeviceId);
      })
      .catch(() => {
        console.log('[STOOA] Audio failed, trying only video');

        return createLocalTrack(MediaType.VIDEO, cameraDeviceId);
      })
      .catch(error => {
        console.log('[STOOA] All attempts creating local tracks failed', error.message);

        return Promise.reject(error);
      });
  };

  const deleteLocalVideo = (): void => {
    const seatNumber = getSeat(userId);

    if (seatNumber !== undefined) {
      const seatHtml = document.getElementById(`seat-${seatNumber}`);
      seatHtml?.querySelector('video')?.remove();
    }
  };

  return { createLocalTrack, createLocalTracks };
};
