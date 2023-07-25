/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useJitsiStore } from '@/store';
import React from 'react';
import { VideoTrackElement } from './VideoTrackElement';
import {
  StyledMutedWrapper,
  StyledPartcipantPlaceholder,
  StyledParticipantName,
  StyledParticipantWorldCafe
} from './styles';
import { AudioTrackElement } from './AudioTrackElement';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import { useConference } from '@/jitsi';

interface Props {
  participant: { id: string };
}

export const Participant = ({ participant }: Props) => {
  const { getTracksByUser } = useJitsiStore();
  const { getParticipantNameById } = useConference();

  const nickName = getParticipantNameById(participant.id);

  const nameInitials = nickName
    ? nickName
        .split(' ')
        .map(string => string[0])
        .join('')
    : '';

  const tracks = getTracksByUser(participant.id);
  const isVideoMuted = tracks?.some(track => track.getType() === 'video' && track.isMuted());
  const isAudioMuted = tracks?.some(track => track.getType() === 'audio' && track.isMuted());

  return (
    <StyledParticipantWorldCafe
      data-userid={participant.id}
      id={participant.id}
      isVideoMuted={isVideoMuted ?? false}
    >
      {nickName && (
        <StyledParticipantName>
          {isAudioMuted && (
            <StyledMutedWrapper>
              <MicMuted />
            </StyledMutedWrapper>
          )}
          {isVideoMuted && (
            <StyledMutedWrapper>
              <VideoMuted />
            </StyledMutedWrapper>
          )}
          {nickName}
        </StyledParticipantName>
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
