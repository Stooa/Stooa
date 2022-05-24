/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledContextButton } from './styles';
import DotsSvg from '@/ui/svg/dots.svg';

interface Props {
  onClick: () => void;
}

const ButtonContextMenu = ({ onClick }: Props) => {
  return (
    <StyledContextButton onClick={onClick}>
      <DotsSvg />
    </StyledContextButton>
  );
};

export default ButtonContextMenu;
