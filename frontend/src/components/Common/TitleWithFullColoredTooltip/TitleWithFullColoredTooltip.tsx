/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useRef, useState } from 'react';
import ColoredFullTooltip from '../ColoredFullTooltip/ColoredFullTooltip';
import {
  StyledTitleWithFullColoredTooltip,
  StyledTitleWithFullColoredTooltipWrapper
} from './styles';
import Info from '@/ui/svg/info-brown.svg';

interface Props {
  children: string | string[] | JSX.Element;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  tooltipText: string;
}

export const TitleWithFullColoredTooltip = ({ children, tooltipText, headingLevel }: Props) => {
  const [arrowPosition, setArrowPosition] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const tipToHover = useRef<HTMLDivElement>(null);

  const handleOnMouseEnter: React.MouseEventHandler = () => {
    if (tipToHover.current) {
      const left = tipToHover.current.offsetLeft;
      setArrowPosition(left + 'px');
      setShowTooltip(true);
    }
  };

  return (
    <StyledTitleWithFullColoredTooltipWrapper>
      <StyledTitleWithFullColoredTooltip as={headingLevel}>
        {children}
      </StyledTitleWithFullColoredTooltip>
      <div
        className="icon-wrapper"
        onClick={() => setShowTooltip(showTooltip => !showTooltip)}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        ref={tipToHover}
      >
        {showTooltip && (
          <ColoredFullTooltip arrowPosition={arrowPosition || ''} text={tooltipText} />
        )}

        <Info />
      </div>
      {showTooltip && <ColoredFullTooltip arrowPosition={arrowPosition || ''} text={tooltipText} />}
    </StyledTitleWithFullColoredTooltipWrapper>
  );
};
