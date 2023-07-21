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
  return (
    <div>
      <StyledWorldCafeVideos id="world-cafe-grid">
        {worldCafeParticipants.map(userId => (
          <Participant userId={userId} key={userId} />
        ))}
      </StyledWorldCafeVideos>
    </div>
  );
};

export default VideoGrid;
