/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useJitsiStore } from '@/store';
import { useConference, useTracks, useLocalTracks, useSeats } from '@/jitsi';

export const useJitsi = () => {
  const { localTracksCreated, localTracksCreatedEvent, localTracksRemovedEvent } = useJitsiStore();
  const {
    sendJoinEvent,
    addTrack,
    sendLeaveEvent,
    leave: conferenceLeave,
    initializeJitsi: conferenceInitializeJitsi,
    initializeConnection: conferenceInitializeConnection,
    getParticipantCount: conferenceGetParticipantCount,
    getParticipants,
    getLocalParticipant,
    kickParticipant: conferenceKickParticipant
  } = useConference();
  const { syncLocalStorageTrack, disposeTracks, playTracks, isParticipantMuted } = useTracks();
  const { hasFreeSeat, create } = useSeats();
  const { createLocalTracks } = useLocalTracks();

  //TODO: Review this
  const joinWorldCafe = async user => {
    console.log('-----> [STOOA] Join world cafe');
    sendJoinEvent(user);

    if (!localTracksCreated) {
      await createLocalTracks().then(tracks => {
        tracks.forEach(async track => {
          await syncLocalStorageTrack(track, user);
          addTrack(track);
        });

        localTracksCreatedEvent();
      });
    }
  };

  const join = async user => {
    if (!hasFreeSeat()) return;

    sendJoinEvent(user);

    if (!localTracksCreated) {
      await createLocalTracks().then(tracks => {
        tracks.forEach(async track => {
          await syncLocalStorageTrack(track, user);
          addTrack(track);
        });

        localTracksCreatedEvent();
      });
    }
  };

  const leave = async () => {
    sendLeaveEvent();
  };

  /**
   * @param {Event} [event] - The event that triggered the unload
   * @param {boolean} [prevent] - If we want to prevent the unload event
   */
  const unload = async () => {
    console.log('[STOOA] Unload');

    await disposeTracks();

    conferenceLeave();

    localTracksRemovedEvent();
  };

  const unloadKickedUser = async participant => {
    console.log('[STOOA] Unload kicked user');

    await disposeTracks(participant.getId());

    localTracksRemovedEvent();
  };

  const initializeJitsi = () => {
    console.log('[STOOA] Initialize jitsi');

    conferenceInitializeJitsi();
  };

  const initializeConnection = (fid, isModerator) => {
    console.log('[STOOA] Initialize connection');

    create(5);

    conferenceInitializeConnection(fid, isModerator);
  };

  const initialInteraction = event => {
    console.log('[STOOA] First interaction', event);

    playTracks();

    window.removeEventListener('mousedown', initialInteraction);
    window.removeEventListener('keydown', initialInteraction);
  };

  const getParticipantCount = () => {
    return conferenceGetParticipantCount();
  };

  const getParticipantList = () => {
    const jitsiParticipants = getParticipants();
    const localParticipant = getLocalParticipant();
    const participants = [];

    if (null !== localParticipant) {
      participants.push(localParticipant);
    }

    jitsiParticipants.map(participant => {
      participants.push({
        id: participant.getId(),
        name: participant.getDisplayName(),
        linkedin: participant.getProperty('linkedin'),
        twitter: participant.getProperty('twitter'),
        isModerator: participant.getProperty('isModerator'),
        isCurrentUser: false,
        joined: participant.getProperty('joined') === 'yes',
        isMuted: isParticipantMuted(participant, 'audio'),
        isVideoMuted: isParticipantMuted(participant, 'video'),
        isJigasi: participant._properties
          ? participant._properties.features_jigasi !== undefined
          : false
      });
    });

    return participants;
  };

  const kickParticipant = (id, reason) => {
    return conferenceKickParticipant(id, reason);
  };

  return {
    getParticipantCount,
    getParticipantList,
    initialInteraction,
    initializeJitsi,
    initializeConnection,
    join,
    joinWorldCafe,
    leave,
    unload,
    kickParticipant,
    unloadKickedUser
  };
};
