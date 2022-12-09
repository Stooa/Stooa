/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ShareIcon from '@/ui/svg/share.svg';
import ShareStopIcon from '@/ui/svg/share-stop.svg';
import { StyledButton } from './style';

interface Props {
  isSharing: boolean;
  onClick: () => void;
}

const ScreenShareButton = ({ isSharing, onClick, ...props }: Props) => {
  return (
    <StyledButton active className={isSharing ? 'sharing' : ''} onClick={onClick} {...props}>
      <span className="button">{isSharing ? <ShareStopIcon /> : <ShareIcon />}</span>
      <div className="text medium">{!isSharing ? 'Compartir pantalla' : 'Dejar de compartir'}</div>
    </StyledButton>
  );
};

export default ScreenShareButton;
