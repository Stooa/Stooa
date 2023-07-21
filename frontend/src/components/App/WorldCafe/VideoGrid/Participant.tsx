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
import { StyledParticipantName, StyledParticipantWorldCafe } from './styles';
import { AudioTrackElement } from './AudioTrackElement';
import { useUser } from '@/jitsi/useUser';

interface Props {
  userId: string;
}

export const Participant = ({ userId }: Props) => {
  const { getConference, getTracksByUser } = useJitsiStore();
  const { getUser } = useUser();

  const participantName =
    getConference().getParticipantById(userId)?.getDisplayName() ?? getUser().nickname;

  const tracks = getTracksByUser(userId);

  return (
    <StyledParticipantWorldCafe data-userid={userId} id={userId}>
      <StyledParticipantName>{participantName}</StyledParticipantName>
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
