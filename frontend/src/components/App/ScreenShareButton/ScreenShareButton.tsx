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
import useTranslation from 'next-translate/useTranslation';

interface Props {
  isSharing: boolean;
  disabled: boolean;
  className: string;
  onClick: () => void;
}

const ScreenShareButton = ({ isSharing, onClick, disabled, className, ...props }: Props) => {
  const { t } = useTranslation('fishbowl');
  return (
    <StyledButton
      data-testid="screen-share-button"
      active
      className={`${isSharing ? 'sharing' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button">{isSharing ? <ShareStopIcon /> : <ShareIcon />}</span>
      <div className="text medium">
        {!isSharing ? t('shareScreenButton') : t('stopShareScreenButton')}
      </div>
    </StyledButton>
  );
};

export default ScreenShareButton;
