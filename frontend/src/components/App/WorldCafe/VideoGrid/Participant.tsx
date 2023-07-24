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
import { useUser } from '@/jitsi/useUser';
import JitsiTrack from 'lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack';

interface Props {
  userId: string;
  tracks: JitsiTrack[] | undefined;
}

export const Participant = ({ userId, tracks }: Props) => {
  const { getConference } = useJitsiStore();
  const { getUser } = useUser();

  const participantName =
    getConference().getParticipantById(userId)?.getDisplayName() ?? getUser().nickname;

  const nameInitials = participantName
    .split(' ')
    .map(string => string[0])
    .join('');

  return (
    <StyledParticipantWorldCafe data-userid={userId} id={userId}>
      <StyledParticipantName>{participantName}</StyledParticipantName>
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
