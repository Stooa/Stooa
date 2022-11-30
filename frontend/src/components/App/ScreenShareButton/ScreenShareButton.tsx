/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';

interface Props {
  isSharing: boolean;
  onClick: () => void;
}

const ScreenShareButton = ({ isSharing, onClick }: Props) => {
  return (
    <Button variant={isSharing ? 'primary' : 'secondary'} onClick={onClick}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quis nostrum vitae tempora quo ad
      consequuntur repellat enim mollitia dolore, deleniti minima blanditiis tenetur voluptates sit.
      Enim numquam iste facilis.
    </Button>
  );
};

export default ScreenShareButton;
