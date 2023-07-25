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

interface Props {
  participant: { id: string; nickname: string };
  maxHeight: string;
  maxWidth: string;
}

export const Participant = ({ participant, maxHeight, maxWidth }: Props) => {
  const { getTracksByUser } = useJitsiStore();

  const nameInitials = participant.nickname
    .split(' ')
    .map(string => string[0])
    .join('');

  const tracks = getTracksByUser(participant.id);
  const isVideoMuted = tracks?.some(track => track.getType() === 'video' && track.isMuted());
  const isAudioMuted = tracks?.some(track => track.getType() === 'audio' && track.isMuted());

  return (
    <StyledParticipantWorldCafe
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      data-userid={participant.id}
      id={participant.id}
      isVideoMuted={isVideoMuted ?? false}
    >
      {participant.nickname && (
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
          {participant.nickname}
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
