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
  StyledPartcipantPlaceholder,
  StyledParticipantName,
  StyledParticipantWorldCafe
} from './styles';
import { AudioTrackElement } from './AudioTrackElement';

interface Props {
  participant: { id: string; nickname: string };
}

export const Participant = ({ participant }: Props) => {
  const { getTracksByUser } = useJitsiStore();

  const nameInitials = participant.nickname
    .split(' ')
    .map(string => string[0])
    .join('');

  const tracks = getTracksByUser(participant.id);

  return (
    <StyledParticipantWorldCafe data-userid={participant.id} id={participant.id}>
      {participant.nickname && (
        <StyledParticipantName>{participant.nickname}</StyledParticipantName>
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
