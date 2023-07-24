/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { StyledWorldCafeVideos } from './styles';
import { Participant } from './Participant';

const VideoGrid = () => {
  const { worldCafeParticipants } = useWorldCafeStore(store => ({
    worldCafeParticipants: store.worldCafeParticipants
  }));

  const getMaxWidth = () => {
    let maxWidth = '100%';

    console.log(worldCafeParticipants.length);

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
      maxHeight = '25%';
    }

    return maxHeight;
  };

  return (
    <div>
      <StyledWorldCafeVideos
        id="world-cafe-grid"
        maxWidth={getMaxWidth()}
        maxHeight={getMaxHeight()}
      >
        {worldCafeParticipants.map(userId => (
          <Participant userId={userId} key={userId} />
        ))}
      </StyledWorldCafeVideos>
    </div>
  );
};

export default VideoGrid;
