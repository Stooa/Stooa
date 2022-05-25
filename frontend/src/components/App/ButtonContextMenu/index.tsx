/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledContextButton, StyledContextMenu } from './styles';
import DotsSvg from '@/ui/svg/dots.svg';

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const ButtonContextMenu = ({ onClick, children, className }: Props) => {
  return (
    <StyledContextButton className={className} onClick={onClick}>
      <DotsSvg />
      <StyledContextMenu>{children}</StyledContextMenu>
    </StyledContextButton>
  );
};

export default ButtonContextMenu;
