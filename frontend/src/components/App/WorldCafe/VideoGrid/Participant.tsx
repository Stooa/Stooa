/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useJitsiStore } from '@/store';
import { VideoTrackElement } from './VideoTrackElement';
import { StyledPartcipantPlaceholder, StyledParticipantWorldCafe } from './styles';
import { AudioTrackElement } from './AudioTrackElement';

import { useConference } from '@/jitsi/useConference';
import { useDevices } from '@/contexts/DevicesContext';
import { ParticipantName } from './ParticipantName';

interface Props {
  participant: { id: string };
  maxHeight: string;
  maxWidth: string;
}

export const Participant = ({ participant, maxHeight, maxWidth }: Props) => {
  const { getTracksByUser, isModerator } = useJitsiStore();
  const { getParticipantNameById, getParticipantById } = useConference();
  const { permissions } = useDevices();

  const nickName = getParticipantNameById(participant.id);
  const participantRole = getParticipantById(participant.id)?.getRole();
  const isParticipantModerator =
    participantRole === 'moderator' || (!participantRole && isModerator);

  const nameInitials = nickName
    ? nickName
        .split(' ')
        .slice(0, 2)
        .map(string => string[0])
        .join('')
        .toUpperCase()
    : '';

  const tracks = getTracksByUser(participant.id);
  const isVideoMuted =
    tracks?.some(track => track.getType() === 'video' && track.isMuted()) || !permissions.video;
  const isAudioMuted =
    tracks?.some(track => track.getType() === 'audio' && track.isMuted()) || !permissions.audio;

  return (
    <StyledParticipantWorldCafe
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      data-userid={participant.id}
      id={participant.id}
      isVideoMuted={isVideoMuted ?? false}
      isModerator={isParticipantModerator}
    >
      {nickName && (
        <ParticipantName
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
          nickName={nickName}
          isModerator={isParticipantModerator}
        />
      )}
      <StyledPartcipantPlaceholder>{nameInitials}</StyledPartcipantPlaceholder>
      {tracks?.map(track => {
        if (track.getType() === 'video') {
          return <VideoTrackElement videoTrack={track} key={track.getId()} />;
        } else {
          return <AudioTrackElement audioTrack={track} key={track.getId()} />;
        }
      })}
    </StyledParticipantWorldCafe>
  );
};
