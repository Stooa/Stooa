/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledMutedWrapper, StyledParticipantName } from './styles';
import MicMuted from '@/ui/svg/mic-muted.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';

interface Props {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  nickName: string;
  isModerator: boolean;
}

export const ParticipantName = ({ isAudioMuted, isVideoMuted, nickName, isModerator }: Props) => {
  return (
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
      {nickName} {isModerator && '(Host)'}
    </StyledParticipantName>
  );
};
