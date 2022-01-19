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

const join = async user => {
  if (!seatsRepository.hasFreeSeat()) return;

  conferenceRepository.sendJoinEvent(user);

  if (!localTracksCreated) {
    await localTracksRepository.createLocalTracks().then(tracks => {
      tracks.forEach(async track => {
        tracksRepository.syncSessionStorageTrack(track, user);
        conferenceRepository.addTrack(track);
      });

      localTracksCreated = true;
    });
  }
};

const leave = async () => {
  conferenceRepository.sendLeaveEvent();
};

const unload = () => {
  console.log('[STOOA] Unload');

  conferenceRepository.leave();
  localTracksCreated = false;

  window.removeEventListener('beforeunload', unload);
  window.removeEventListener('unload', unload);
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
      joined: participant.getProperty('joined') === 'yes',
      isMuted: tracksRepository.isParticipantMuted(participant, 'audio'),
      isVideoMuted: tracksRepository.isParticipantMuted(participant, 'video')
    });
  });

  return participants;
};

export {
  getParticipantCount,
  getParticipantList,
  initialInteraction,
  initializeJitsi,
  initializeConnection,
  join,
  leave,
  unload
};
