/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import conferenceRepository from '@/jitsi/Conference';
import seatsRepository from '@/jitsi/Seats';
import tracksRepository from '@/jitsi/Tracks';
import localTracksRepository from '@/jitsi/LocalTracks';

let localTracksCreated = false;

const join = async (user, seat) => {
  if (!seatsRepository.hasFreeSeat()) return;

  conferenceRepository.sendJoinEvent(user, seat);

  if (!localTracksCreated) {
    await localTracksRepository.createLocalTracks().then(tracks => {
      tracks.forEach(async track => {
        await tracksRepository.syncLocalStorageTrack(track, user);
        conferenceRepository.addTrack(track);
      });
      localTracksCreated = true;
    });
  }
};

const leave = async () => {
  conferenceRepository.sendLeaveEvent();
};
/**
 * @param {Event} [event] - The event that triggered the unload
 * @param {boolean} [prevent] - If we want to prevent the unload event
 */
const unload = async () => {
  console.log('[STOOA] Unload');

  await tracksRepository.disposeTracks();

  conferenceRepository.leave();

  localTracksCreated = false;
};

const unloadKickedUser = async participant => {
  console.log('[STOOA] Unload kicked user');

  await tracksRepository.disposeTracks(participant.getId());

  localTracksCreated = false;
};

const initializeJitsi = () => {
  console.log('[STOOA] Initialize jitsi');

  conferenceRepository.initializeJitsi();
};

const initializeConnection = (fid, isModerator) => {
  console.log('[STOOA] Initialize connection');

  seatsRepository.create(5);

  conferenceRepository.initializeConnection(fid, isModerator);
};

const initialInteraction = event => {
  console.log('[STOOA] First interaction', event);

  tracksRepository.playTracks();

  window.removeEventListener('mousedown', initialInteraction);
  window.removeEventListener('keydown', initialInteraction);
};

const getParticipantCount = () => {
  return conferenceRepository.getParticipantCount();
};

const getParticipantList = () => {
  const jitsiParticipants = conferenceRepository.getParticipants();
  const localParticipant = conferenceRepository.getLocalParticipant();
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
      joined: participant.getProperty('joined') !== 'no',
      isMuted: tracksRepository.isParticipantMuted(participant, 'audio'),
      isVideoMuted: tracksRepository.isParticipantMuted(participant, 'video')
    });
  });

  return participants;
};

const kickParticipant = (id, reason) => {
  return conferenceRepository.kickParticipant(id, reason);
};

export {
  getParticipantCount,
  getParticipantList,
  initialInteraction,
  initializeJitsi,
  initializeConnection,
  join,
  leave,
  unload,
  kickParticipant,
  unloadKickedUser
};
