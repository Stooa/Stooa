/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VideoIcon from '@/ui/svg/video.svg';
import VideoMutedIcon from '@/ui/svg/video-muted.svg';
import { StyledButton } from './style';

interface Props {
  isSharing: boolean;
  onClick: () => void;
}

const ScreenShareButton = ({ isSharing, onClick }: Props) => {
  return (
    <StyledButton active className={isSharing ? 'sharing' : ''} onClick={onClick}>
      <span className="button">{isSharing ? <VideoMutedIcon /> : <VideoIcon />}</span>
      <div className="text medium">{!isSharing ? 'Compartir pantalla' : 'Dejar de compartir'}</div>
    </StyledButton>
  );
};

export default ScreenShareButton;
