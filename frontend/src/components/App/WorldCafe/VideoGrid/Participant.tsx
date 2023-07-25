/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useJitsiStore } from '@/store';
import React, { useRef } from 'react';
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
import useEventListener from '@/hooks/useEventListener';
import { CONFERENCE_IS_MODERATOR } from '@/jitsi/Events';
import { useConference } from '@/jitsi/useConference';
import { useDevices } from '@/contexts/DevicesContext';

interface Props {
  participant: { id: string };
  maxHeight: string;
  maxWidth: string;
}

export const Participant = ({ participant, maxHeight, maxWidth }: Props) => {
  const { getTracksByUser } = useJitsiStore();
  const { getParticipantNameById } = useConference();
  const { permissions } = useDevices();
  const isModerator = useRef(false);

  const nickName = getParticipantNameById(participant.id);

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

  useEventListener(CONFERENCE_IS_MODERATOR, () => {
    isModerator.current = true;
  });

  return (
    <StyledParticipantWorldCafe
      maxHeight={maxHeight}
      maxWidth={maxWidth}
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
          {nickName} {isModerator.current && '(Host)'}
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
