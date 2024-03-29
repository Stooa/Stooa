/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ReactElement } from 'react';
import { StyledTooltip } from './styles';

interface Props {
  arrowPosition: string;
  text: string | ReactElement;
}

const ColoredFullTooltip = ({ arrowPosition, text }: Props) => {
  return (
    <StyledTooltip>
      <div
        className="arrow"
        style={{ '--leftPosition': arrowPosition } as React.CSSProperties}
      ></div>
      {text}
    </StyledTooltip>
  );
};

export default ColoredFullTooltip;
