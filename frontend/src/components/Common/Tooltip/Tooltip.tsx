/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledTooltip } from './styles';

interface Props {
  children: React.ReactNode;
  showTooltip: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
}

const Tooltip = ({ children, showTooltip, position = 'top', arrow = false }: Props) => {
  return (
    <StyledTooltip
      className={`body-xs ${showTooltip ? 'show' : ''} ${position} ${arrow ? 'arrow' : ''}`}
    >
      {children}
    </StyledTooltip>
  );
};

export default Tooltip;
