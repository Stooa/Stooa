/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import {
  StyledParticipantCounter,
  StyledVideoGridHeader,
  StyledVideoGridTitle,
  StyledVideoGridWrapper,
  StyledWorldCafeVideos
} from './styles';
import { Participant } from './Participant';
import People from '@/ui/svg/people.svg';

const VideoGrid = () => {
  const { worldCafe, worldCafeParticipants } = useWorldCafeStore(store => ({
    worldCafe: store.worldCafe,
    worldCafeParticipants: store.worldCafeParticipants
  }));

  const getMaxWidth = () => {
    let maxWidth = '100%';

    if (worldCafeParticipants.length > 6) {
      maxWidth = '25%';
    } else {
      switch (worldCafeParticipants.length) {
        case 1:
          maxWidth = '100%';
          break;
        case 2:
        case 3:
        case 4:
          maxWidth = '50%';
          break;

        case 5:
        case 6:
          maxWidth = '33%';
          break;
      }
    }

    return maxWidth;
  };

  const getMaxHeight = () => {
    let maxHeight: string;

    if (worldCafeParticipants.length === 1) {
      maxHeight = '100%';
    } else if (worldCafeParticipants.length > 1 && worldCafeParticipants.length <= 8) {
      maxHeight = '50%';
    } else {
      maxHeight = '33%';
    }

    return maxHeight;
  };

  const maxWidth = getMaxWidth();
  const maxHeight = getMaxHeight();

  return (
    <StyledVideoGridWrapper>
      <StyledVideoGridHeader>
        <StyledVideoGridTitle className="title-md medium">
          {worldCafe?.name ?? 'WorldCafe'}
        </StyledVideoGridTitle>
        <StyledParticipantCounter className="medium">
          <People />
          {worldCafeParticipants.length}
        </StyledParticipantCounter>
      </StyledVideoGridHeader>
      <StyledWorldCafeVideos id="world-cafe-grid">
        {worldCafeParticipants.map(participant => (
          <Participant
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            participant={participant}
            key={participant.id}
          />
        ))}
      </StyledWorldCafeVideos>
    </StyledVideoGridWrapper>
  );
};

export default VideoGrid;
